import { Project, SourceFile } from 'ts-morph';
import { trim } from 'lodash-es';

export function getAllImports(tsconfigPath: string) {
  const project = new Project({
    tsConfigFilePath: tsconfigPath,
  });
  const files = project.getSourceFiles();
  return files.flatMap((f) => getImportsInFile(f));
}

export type ModuleId = string;

function getImportsInFile(f: SourceFile): ModuleId[] {
  return f
    .getImportDeclarations()
    .map((i) => trim(i.getModuleSpecifier().getText(), "'"));
}
