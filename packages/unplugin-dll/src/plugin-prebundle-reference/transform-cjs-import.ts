import type { Node } from 'estree';
import { walk } from 'estree-walker';
import MagicString from 'magic-string';
import { UnpluginBuildContext, UnpluginContext } from 'unplugin';
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
      return prebundle.isCommonJS;
    }
    return false;
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
          if (shouldTransform(source)) {
            hasChanges = true;
            magicString.remove(node.start, node.end);
            const importSpecifiers = node.specifiers;
            const ns = namingCounter.next('');
            const changes: string[] = [];
            changes.push(`import ${ns} from '${source}';`);
            for (const importSpecifier of importSpecifiers) {
              if (importSpecifier.type === 'ImportDefaultSpecifier') {
                changes.push(`const ${importSpecifier.local.name} = ${ns};`);
              } else if (importSpecifier.type === 'ImportNamespaceSpecifier') {
                changes.push(`const ${importSpecifier.local.name} = ${ns};`);
              } else if (importSpecifier.type === 'ImportSpecifier') {
                changes.push(
                  `const ${importSpecifier.local.name} = ${ns}.${importSpecifier.imported.name};`,
                );
              }
            }
            magicString.appendRight(node.start, changes.join('\n'));
          }
        }
      },
    });
    if (hasChanges) {
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
