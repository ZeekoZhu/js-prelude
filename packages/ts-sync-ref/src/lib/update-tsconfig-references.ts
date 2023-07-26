/**
 * update references in tsconfig.json
 * @param tsconfigFile content of tsconfig.json
 * @param paths references to update
 */
export function updateTsconfigReferences(tsconfigFile: string, paths: string[]) {
  if (containsReferences(tsconfigFile)) {
    return updateExistingReferences(tsconfigFile, paths);
  } else {
    return addReferences(tsconfigFile, paths);
  }
}

const referencesKeyRegex = /"references"\s*:\s*\[/;

function containsReferences(tsconfigFile: string) {
  return referencesKeyRegex.test(tsconfigFile);
}

function updateExistingReferences(tsconfigFile: string, paths: string[]) {
  // find the first `[` after `references`
  const indexOfReferences = tsconfigFile.search(referencesKeyRegex);
  const indexOfFirstBracket = tsconfigFile.indexOf('[', indexOfReferences);
  // find the first `]` after `references`
  const indexOfLastBracket = tsconfigFile.indexOf(']', indexOfFirstBracket);
  // split the string into 3 parts
  const beforeReferences = tsconfigFile.slice(0, indexOfFirstBracket + 1);
  const afterReferences = tsconfigFile.slice(indexOfLastBracket);
  return `${beforeReferences}\n${formatPaths(paths)}\n${afterReferences}`;
}

function addReferences(tsconfigFile: string, paths: string[]) {
  const newReferences = `"references": [\n${formatPaths(paths)}\n]`;

  // find the first `{`
  const indexOfFirstBracket = tsconfigFile.indexOf('{');
  // split the string into 2 parts
  const beforeReferences = tsconfigFile.slice(0, indexOfFirstBracket + 1);
  const afterReferences = tsconfigFile.slice(indexOfFirstBracket + 1);
  return `${beforeReferences}\n${newReferences},\n${afterReferences}`;
}

function formatPaths(paths: string[]) {
  return paths.map((it) => `{"path": "${it}"}`).join(',\n');
}
