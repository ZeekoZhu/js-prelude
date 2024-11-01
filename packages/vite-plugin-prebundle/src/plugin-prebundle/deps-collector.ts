import { escapeRegExp } from 'lodash-es';
import type { PluginContext } from 'rollup';
import { makeIdentifierFromModuleId } from '../utils';
import { findImportModules } from './find-import-modules';
import { Lookup } from './lookup';
import { ModuleMergeRules } from './module-merge-rules';

/**
 * Collect dependencies for a set of module during the `resolve` phase of Vite.
 */
export class DepsCollector {
  public directDeps = new Set<string>();
  /**
   * direct dep -> transitive dep
   */
  public transitiveDeps = new Lookup<string>();
  /**
   * Modules that can be resolved
   * @private
   */
  public deps = new Set<string>();
  private done = false;
  private failed = new Set<string>();
  private visited = new Set<string>();

  async collectFromDirectDep(ctx: PluginContext, directDepModuleId: string) {
    if (this.isVisited(directDepModuleId)) {
      return;
    }
    const transitiveDeps: string[] = await this.getImportedIds(
      directDepModuleId,
      ctx,
    );
    // .css file will be stripped out by vite in the final build
    // we should not create entry for them
    if (directDepModuleId.endsWith('.css')) {
      return;
    }
    this.deps.add(directDepModuleId);
    for (const transitiveDep of transitiveDeps) {
      if (transitiveDep.endsWith('.css')) {
        continue;
      }
      this.transitiveDeps.add(directDepModuleId, transitiveDep);
      this.deps.add(transitiveDep);
    }
  }

  async collectWithVite(ctx: PluginContext) {
    if (this.done) {
      ctx.warn('[collect-deps] Collecting is done, cannot collect again');
      return;
    }
    for (const directDep of this.directDeps) {
      ctx.debug(`[collect-deps] Collecting dependencies for ${directDep}`);
      await this.collectFromDirectDep(ctx, directDep);
    }
    this.done = true;
  }

  /**
   * Get all imported IDs of a module recursively
   * @param id
   * @param ctx
   * @param importer
   */
  private getImportedIds = async (
    id: string,
    ctx: PluginContext,
    importer?: string,
  ) => {
    if (this.visited.has(id)) {
      return [];
    }
    this.visited.add(id);
    ctx.debug(`[collect-deps] Resolving module '${id}' from '${importer}'`);
    const resolution = await ctx.resolve(id, importer, {
      isEntry: false,
      skipSelf: true,
    });
    if (!resolution) {
      this.failed.add(id);
      ctx.warn(
        `[collect-deps] Cannot resolve module '${id}' from '${importer}'`,
      );
      return [];
    }
    ctx.debug(`[collect-deps] Resolved module '${id}' to '${resolution.id}'`);
    const moduleInfo = await ctx.load({
      ...resolution,
      resolveDependencies: true,
    });

    if (!moduleInfo || !moduleInfo.ast) {
      ctx.warn(`[collect-deps] Cannot load module: ${id}`);
      return [];
    }
    const result = findImportModules(moduleInfo.ast).filter(
      (id) => !id.startsWith('\0'),
    );
    ctx.debug(`[collect-deps] Found ${result.join(', ')} in ${id}`);
    for (const depId of result) {
      result.push(...(await this.getImportedIds(depId, ctx, resolution.id)));
    }
    return result;
  };

  /**
   * Check if a module has been visited
   * @param directDepModuleId
   */
  private isVisited = (directDepModuleId: string) => {
    return (
      this.deps.has(directDepModuleId) || this.failed.has(directDepModuleId)
    );
  };
}

/**
 * add merge rules for transitive dependencies
 */
export function addTransitiveMergeRules(
  mergeRules: ModuleMergeRules,
  transitiveDeps: Lookup<string>,
) {
  for (const [directDep, transitives] of transitiveDeps.entries()) {
    const matchModuleRegex = new RegExp(
      '^(' +
        Array.from(transitives)
          .map((it) => escapeRegExp(it))
          .join('|') +
        ')$',
    );
    const ruleForDirectDep = mergeRules.getMatchingRule(directDep);
    if (ruleForDirectDep) {
      mergeRules.addRule({
        ruleName: ruleForDirectDep,
        matchModule: matchModuleRegex,
      });
    } else {
      const ruleName = 'transitive_' + makeIdentifierFromModuleId(directDep);
      mergeRules.addRule({ ruleName, matchModule: matchModuleRegex });
    }
  }
}
