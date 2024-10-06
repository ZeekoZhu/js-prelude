import { walk } from 'estree-walker';
import type { ProgramNode } from 'rollup';

export function findImportModules(ast: ProgramNode): string[] {
  // find all import statements
  // * import 'module'
  // * import * as module from 'module'
  // * import { module } from 'module'
  // * import module from 'module'
  const result = new Set<string>();
  walk(ast, {
    enter(node, parent) {
      if (node.type === 'ImportDeclaration') {
        if (typeof node.source.value === 'string') {
          result.add(node.source.value);
        }
      }
      if (
        node.type === 'CallExpression' &&
        node.callee.type === 'ImportExpression'
      ) {
        if (
          node.arguments.length === 1 &&
          node.arguments[0].type === 'Literal' &&
          typeof node.arguments[0].value === 'string'
        ) {
          // import('module')
          result.add(node.arguments[0].value);
        }
      }
      // export * from 'module'
      // export { module } from 'module'
      if (
        node.type === 'ExportAllDeclaration' ||
        node.type === 'ExportNamedDeclaration'
      ) {
        if (node.source && typeof node.source.value === 'string') {
          result.add(node.source.value);
        }
      }
    },
  });
  return Array.from(result);
}
