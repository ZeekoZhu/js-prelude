import esbuild from 'esbuild';
import { filter, get, isEmpty, uniq } from 'lodash-es';
import { EmittedChunk, PluginContext } from 'rollup';
import { Plugin, UserConfig } from 'vite';

import { PreBundleEntry, PrebundleOptions } from '../types';
import { makeIdentifierFromModuleId } from '../utils';
import { DepsCollector } from './deps-collector';
import { ModuleMergeRules } from './module-merge-rules';

const FAKE_ENTRY = '\0virtual:prebundle-entry';
const PREFIX_MERGED_MODULE = '\0virtual:prebundle-merge-';

export function preBundle(pluginOpt: PrebundleOptions): Plugin[] {
  let projectImports: string[] = [];
  const depsCollector = new DepsCollector();
  const preBundleEntries = new PrebundleFiles();
  const moduleMergeRules = new ModuleMergeRules(pluginOpt.merge ?? {});
  let isDev = false;
  return [
    {
      name: 'plugin-prebundle',
      enforce: 'pre',
      config(config) {
        return {
          build: {
            lib: {
              entry: FAKE_ENTRY,
              formats: ['es'],
              name: 'do_not_emit_this_file',
              fileName: 'do_not_emit_this_file',
            },
            rollupOptions: {
              output: {
                chunkFileNames: (chunkInfo) => {
                  if (chunkInfo.name.startsWith('pre-bundle-')) {
                    return `[name]-[hash].mjs`;
                  } else {
                    // avoid vite treat prebundle files as cjs
                    // https://github.com/vitejs/vite/blob/fafc7e28d3395292fbc2f2355417dcc15871ab1e/packages/vite/src/node/plugins/importAnalysis.ts#L599
                    if (chunkInfo.name.includes('_vite-browser-external')) {
                      return `pre-bundle-chunk-vite-internals-[hash].mjs`;
                    }
                    return `pre-bundle-chunk-[name]-[hash].mjs`;
                  }
                },
              },
            },
          },
        } as UserConfig;
      },
      async configResolved(cfg) {
        isDev = cfg.mode === 'development';
        projectImports = uniq([...(pluginOpt.include ?? [])]);
      },
      async buildStart() {
        // collect deps
        projectImports.forEach((id) => depsCollector.directDeps.add(id));
        await depsCollector.collectWithVite(this as PluginContext);

        moduleMergeRules.addRules(
          depsCollector.mergeTransitiveDepRules(moduleMergeRules),
        );
        // to prebundle files
        const files = toPrebundleFiles(
          filter([...depsCollector.deps], (id) =>
            shouldPrebundle(id, pluginOpt.exclude ?? []),
          ),
          moduleMergeRules,
        );

        // prepare chunk emitting
        preBundleEntries.onEnqueue = async (file) => {
          const outputFile = this.emitFile(toChunk(file));
          preBundleEntries.markEmitted(file, outputFile);
        };
        files.forEach((f) => preBundleEntries.enqueue(f));
      },
      resolveId: {
        order: 'pre',
        async handler(source, importer, options) {
          if (source.endsWith(FAKE_ENTRY)) {
            return {
              id: FAKE_ENTRY,
            };
          }
          if (source.startsWith(PREFIX_MERGED_MODULE)) {
            return {
              id: source,
            };
          }
          return null;
        },
      },
      load(id) {
        if (id === FAKE_ENTRY) {
          return '';
        } else if (id.startsWith(PREFIX_MERGED_MODULE)) {
          const prebundleFileName = id.slice(PREFIX_MERGED_MODULE.length);
          const file = preBundleEntries.files.get(prebundleFileName);
          if (file == null) {
            this.error(`Cannot find prebundle file: ${prebundleFileName}`);
          } else {
            const { code } = makeMergedModule(file);
            return code;
          }
        }
        return null;
      },

      generateBundle: {
        order: 'post',
        async handler(_, chunkMap) {
          delete chunkMap['do_not_emit_this_file.mjs'];
          const entries: PreBundleEntry[] = [];
          for (const id of preBundleEntries.emittedModules()) {
            const entry = preBundleEntries.entries.get(id);
            if (!entry) {
              throw new Error(`Cannot find prebundle entry for ${id}`);
            }
            const updated: PreBundleEntry = {
              ...entry,
              moduleFilePath: this.getFileName(entry.moduleFilePath),
            };
            const resolution = await this.resolve(entry.moduleId, undefined, {
              isEntry: false,
            });
            if (!resolution) {
              this.warn(`Cannot resolve prebundle module: ${entry.moduleId}`);
              continue;
            }
            // get module info at bundle phase to ensure virtual modules are
            // loaded
            const moduleInfo = this.getModuleInfo(resolution.id);
            if (moduleInfo) {
              updated.exports = moduleInfo.exports ?? [];
              updated.isCommonJS = get(
                moduleInfo.meta,
                'commonjs.isCommonJS',
                false,
              );
              if (updated.isCommonJS && isEmpty(updated.exportAs)) {
                updated.exportAs = 'default';
              }
            } else {
              this.warn(`Cannot find module info: ${entry.moduleId}`);
            }
            entries.push(updated);
          }
          this.emitFile({
            type: 'asset',
            name: 'pre-bundle-manifest.json',
            source: JSON.stringify(entries),
          });
        },
      },
    },
    {
      name: 'minify-bundle',
      async generateBundle(_, bundle) {
        if (isDev) {
          return;
        }
        for (const asset of Object.values(bundle)) {
          if (asset.type == 'chunk')
            asset.code = (
              await esbuild.transform(asset.code, { minify: true })
            ).code;
        }
      },
    },
  ];
}

type PrebundleFileName = string;
type ModuleId = string;

/**
 * Abstract data structure for prebundle file.
 * A file can be a single module or a merged module.
 */
interface PrebundleFile {
  /**
   * If the file is a single module, the name is the module ID.
   * If the file is a merged module, the name is the rule name.
   */
  name: PrebundleFileName;
  entries: PreBundleEntry[];
}

class PrebundleFiles {
  todo = new Set<PrebundleFileName>();
  emitted = new Set<PrebundleFileName>();
  bundled = new Set<PrebundleFileName>();
  entries = new Map<ModuleId, PreBundleEntry>();
  files = new Map<PrebundleFileName, PrebundleFile>();
  onEnqueue?: (file: PrebundleFile) => Promise<void>;

  enqueue(file: PrebundleFile) {
    if (this.emitted.has(file.name) || this.bundled.has(file.name)) {
      return;
    }
    this.todo.add(file.name);
    this.files.set(file.name, file);
    void this.onEnqueue?.(file);
  }

  markEmitted(file: PrebundleFile, chunkFileName: string) {
    if (this.todo.has(file.name)) {
      this.emitted.add(file.name);
      this.todo.delete(file.name);
      const entries = file.entries.map(
        (entry) =>
          ({
            ...entry,
            moduleFilePath: chunkFileName,
          } as PreBundleEntry),
      );
      entries.forEach((entry) => this.entries.set(entry.moduleId, entry));
    }
  }

  emittedModules() {
    return Array.from(this.files.entries())
      .filter(([file]) => this.emitted.has(file))
      .map(([, file]) => file.entries.map((entry) => entry.moduleId))
      .flat();
  }
}

function shouldPrebundle(id: string, blockList: RegExp[]) {
  return (
    !id.startsWith('.') &&
    !id.startsWith('~') &&
    !id.startsWith('\0') &&
    !id.startsWith('/') &&
    !blockList.some((it) => it.test(id))
  );
}

/**
 * Convert dependencies to prebundle files
 * @param deps
 * @param mergeRules
 */
function toPrebundleFiles(
  deps: string[],
  mergeRules: ModuleMergeRules,
): PrebundleFile[] {
  const singleModuleFiles: PrebundleFile[] = [];
  const mergedModuleFiles: Map<PrebundleFileName, PrebundleFile> = new Map();
  for (const dep of deps) {
    const entry: PreBundleEntry = {
      moduleId: dep,
      moduleFilePath: '',
      exports: [],
      isCommonJS: false,
    };
    const rule = mergeRules.getRule(dep);
    if (rule) {
      const file = mergedModuleFiles.get(rule);
      entry.exportAs = `__ns_${makeIdentifierFromModuleId(dep)}`;
      if (file) {
        file.entries.push(entry);
      } else {
        mergedModuleFiles.set(rule, {
          name: rule,
          entries: [entry],
        });
      }
    } else {
      singleModuleFiles.push({
        name: dep,
        entries: [entry],
      });
    }
  }
  // if a mergedModuleFile has only one entry, move it to singleModuleFiles
  for (const [rule, file] of mergedModuleFiles) {
    if (file.entries.length === 1) {
      singleModuleFiles.push(file);
      mergedModuleFiles.delete(rule);
    }
  }
  return singleModuleFiles.concat(Array.from(mergedModuleFiles.values()));
}

function toChunk(file: PrebundleFile): EmittedChunk {
  if (file.entries.length > 1) {
    return {
      id: `${PREFIX_MERGED_MODULE}${file.name}`,
      name: `pre-bundle-merge-${makeIdentifierFromModuleId(file.name)}`,
      preserveSignature: 'allow-extension',
      type: 'chunk',
    };
  } else if (file.entries.length === 1) {
    const entry = file.entries[0];
    return {
      id: entry.moduleId,
      name: `pre-bundle-${makeIdentifierFromModuleId(entry.moduleId)}`,
      preserveSignature: 'allow-extension',
      type: 'chunk',
    };
  }
  throw new Error('Cannot convert empty file to chunk');
}

function makeMergedModule(file: PrebundleFile): {
  code: string;
} {
  if (file.entries.length < 2) {
    throw new Error('Cannot merge single module');
  }

  function reexportModule(id: string) {
    const importName = makeIdentifierFromModuleId(id);
    const exportAs = `__ns_${importName}`;
    const importCode = `import * as ${importName} from '${id}';`;
    const exportCode = `export const ${exportAs} = ${importName};`;
    return {
      importCode,
      exportCode,
    };
  }

  const imports: string[] = [];
  const exports: string[] = [];
  for (const entry of file.entries) {
    const { importCode, exportCode } = reexportModule(entry.moduleId);
    imports.push(importCode);
    exports.push(exportCode);
  }
  return {
    code: `${imports.join('\n')}\n\n${exports.join('\n')}`,
  };
}
