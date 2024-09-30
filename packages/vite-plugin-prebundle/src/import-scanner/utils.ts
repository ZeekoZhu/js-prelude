import { fs, glob, path } from 'zx';
import { ImportCounter } from './import-counter';

export const findProjectImports = async (
  directoryPath: string,
  blockList: RegExp[],
  threshold: number,
) => {
  if (!directoryPath) {
    throw new Error('Please provide a directory path.');
  }

  try {
    // Use glob to find all .ts and .tsx files
    const files: string[] = await glob(
      path.join(directoryPath, '**/*.{ts,tsx}'),
      {
        gitignore: true,
        ignoreFiles: [
          '**/*.spec.ts',
          '**/*.spec.tsx',
          '**/*.test.ts',
          '**/*.test.tsx',
        ],
      },
    );

    const moduleIds = new ImportCounter(blockList);

    // Read each file and extract module IDs
    for (const file of files) {
      const content: string = await fs.readFile(file, 'utf-8');
      extractModuleIds(content, moduleIds);
    }

    return Array.from(moduleIds.getImports().entries())
      .filter(([, cnt]) => cnt > threshold)
      .map(([id]) => id);
  } catch (error) {
    throw new Error(`Error reading files: ${error}`);
  }
};

/**
 * Function to extract module IDs from import statements
 * @param content
 * @param importCounter
 */
export function extractModuleIds(
  content: string,
  importCounter: ImportCounter,
) {
  const importRegex = /import\s+(?:[^'"]*\s+from\s+)?['"]([^'"]+)['"]/g;
  const dynamicImportRegex = /import\(['"]([^'"]+)['"]\)/g;
  const typeImportRegex = /import\s+type/;

  let match: RegExpExecArray | null;

  while ((match = importRegex.exec(content)) !== null) {
    if (typeImportRegex.test(match[0])) {
      continue;
    }
    importCounter.addImport(match[1]);
  }

  while ((match = dynamicImportRegex.exec(content)) !== null) {
    importCounter.addImport(match[1]);
  }
}
