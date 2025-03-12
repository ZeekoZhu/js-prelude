export const PLUGIN_BUNDLE_HELPER = `\0virtual:prebundle-ref-helper`;
export const pluginBundleHelper = `
export function _prebundle_merge_get_default(moduleLike) {
  return moduleLike.default ?? moduleLike;
}

export function _prebundle_merge_get_named(moduleLike, name) {
  if(name in moduleLike){
    return moduleLike[name];
  }
  if(moduleLike.default && name in moduleLike.default) {
    return moduleLike.default[name];
  }
}
`;

export function importPrebundleHelper() {
  return `import { _prebundle_merge_get_default, _prebundle_merge_get_named } from '${PLUGIN_BUNDLE_HELPER}';`;
}

export function importNs(
  moduleId: string,
  exportAs: string,
  nsLocalName: string,
) {
  return `import { ${exportAs} as ${nsLocalName} } from '${moduleId}';`;
}

/**
 * ```
 * const localName = _prebundle_merge_get_default(nsLocalName);
 * ```
 * @param nsLocalName
 * @param localName
 */
export function importDefaultWithHelper(
  nsLocalName: string,
  localName: string,
) {
  return `const ${localName} = _prebundle_merge_get_default(${nsLocalName});`;
}

/**
 * ```
 * const localName = _prebundle_merge_get_named(nsLocalName, 'name');
 * ```
 * @param nsLocalName
 * @param name
 * @param localName
 */
export function importNamedWithHelper(
  nsLocalName: string,
  name: string,
  localName: string,
) {
  return `const ${localName} = _prebundle_merge_get_named(${nsLocalName}, '${name}');`;
}

/**
 * ```
 * export { name: _prebundle_merge_get_default(nsLocalName) }
 * ```
 * @param nsLocalName
 * @param names
 */
export function exprotNamedWithHelper(nsLocalName: string, names: string[]) {
  const objectAssignments = names
    .map((n) => `'${n}':_prebundle_merge_get_named(${nsLocalName}, '${n}')`)
    .join(',');
  return `export {${objectAssignments}};`;
}
