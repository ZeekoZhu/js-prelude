import { uniq } from 'lodash-es';
import { globby, path, fs } from 'zx';
import { ModuleId } from './get-all-imports';

export async function getAllImportRegex(
  tsconfigPath: string,
  sourceFileGlobPattern: string,
) {
  const sourceFiles = await globby(sourceFileGlobPattern, {
    cwd: path.dirname(tsconfigPath),
    absolute: true,
  });
  const tasks = sourceFiles.map(async (f) => {
    const code = await fs.readFile(f, 'utf-8');
    return getImportModuleIdInFile(code);
  });
  return uniq((await Promise.all(tasks)).flat()).filter(
    (it) => !it.startsWith('.') && !it.startsWith('~'),
  );
}

function getImportModuleIdInFile(code: string): ModuleId[] {
  /**
   * import { foo } from 'bar';
   * import foo from '~/bar';
   * import * as foo from '@bar/alice';
   * import foo, { bar } from '../baz';
   * import foo, * as bar from 'bar/foo';
   */
  // we need to extract 'baz' from the above code

  const moduleIdList: ModuleId[] = [];
  const staticImport = /import\s+.+?\s+from\s+['"](.+?)['"]/g;
  const matches = [...code.matchAll(staticImport)];
  moduleIdList.push(...matches.map((m) => m[1]));
  /**
   * import('foo');
   */
  const dynamicImport = /import\s*\(\s*['"](.+?)['"]\s*\)/g;
  const matches2 = [...code.matchAll(dynamicImport)];
  moduleIdList.push(...matches2.map((m) => m[1]));
  /**
   * import 'foo';
   */
  const sideEffectImport = /^import\s+['"](.+?)['"]/g;
  const matches3 = [...code.matchAll(sideEffectImport)];
  moduleIdList.push(...matches3.map((m) => m[1]));
  return moduleIdList;
}
