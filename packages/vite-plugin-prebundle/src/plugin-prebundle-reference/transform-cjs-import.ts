import type { Node } from 'estree';
import { walk } from 'estree-walker';
import { isEmpty } from 'lodash-es';
import MagicString from 'magic-string';
import { UnpluginBuildContext, UnpluginContext } from 'unplugin';
import { makeIdentifierFromModuleId } from '../utils';
import {
  importDefaultWithHelper,
  importNamedWithHelper,
  importNs,
  importPrebundleHelper,
} from './prebundle-helper';
import { PreBundleReferenceManager } from './prebundle-reference-manager';
import { NamingCounter } from './utils';

export function transformCjsImport(
  this: UnpluginBuildContext & UnpluginContext,
  prebundleRefManager: PreBundleReferenceManager,
  code: string,
  id: string,
) {
  function shouldTransform(moduleId: string) {
    const prebundle = prebundleRefManager.getPreBundledModule(moduleId);
    if (prebundle) {
      return [!isEmpty(prebundle.exportAs), prebundle] as const;
    }
    return [false, null] as const;
  }

  // transform named import from commonjs module to default import
  try {
    const ast = this.parse(code);
    const magicString = new MagicString(code);
    const namingCounter = new NamingCounter('__prebundle_');
    let hasChanges = false;
    walk(ast as Node, {
      enter(node: any) {
        if (node.type === 'ImportDeclaration') {
          const source: string = node.source.value;
          const [needTransform, prebundle] = shouldTransform(source);
          if (needTransform && prebundle && prebundle.exportAs) {
            hasChanges = true;
            const importSpecifiers = node.specifiers;
            const ns = namingCounter.next(
              makeIdentifierFromModuleId(prebundle.moduleId),
            );
            const changes: string[] = [];
            changes.push(importNs(source, prebundle.exportAs, ns));
            for (const importSpecifier of importSpecifiers) {
              if (importSpecifier.type === 'ImportDefaultSpecifier') {
                changes.push(
                  importDefaultWithHelper(ns, importSpecifier.local.name),
                );
              } else if (importSpecifier.type === 'ImportNamespaceSpecifier') {
                changes.push(`const ${importSpecifier.local.name} = ${ns};`);
              } else if (importSpecifier.type === 'ImportSpecifier') {
                changes.push(
                  importNamedWithHelper(
                    ns,
                    importSpecifier.imported.name,
                    importSpecifier.local.name,
                  ),
                );
              }
            }
            magicString.remove(node.start, node.end);
            magicString.appendRight(node.start, changes.join('\n'));
          }
        } else if (node.type === 'ExportNamedDeclaration') {
          // todo: maybe export statement should be handled
        }
      },
    });
    if (hasChanges) {
      magicString.prepend(importPrebundleHelper());
      return {
        code: magicString.toString(),
        map: magicString.generateMap({ hires: 'boundary', source: id }),
      };
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
}
