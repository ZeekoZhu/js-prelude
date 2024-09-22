import { get, uniq } from 'lodash-es';
import { Plugin, UserConfig } from 'vite';
import { fs, glob, path } from 'zx';

import { PreBundleEntry, PrebundleOptions } from '../types';
import { makeIdentifierFromModuleId } from '../utils';
import { ImportCounter } from './import-counter';

/**
 * Function to extract module IDs from import statements
 * @param content
 * @param importCounter
 */
function extractModuleIds(content: string, importCounter: ImportCounter) {
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

export function preBundle(pluginOpt: PrebundleOptions): Plugin[] {
  const FAKE_ENTRY = '\0virtual:prebundle-entry';
  let projectImports: string[] = [];
  const preBundleEntries: PreBundleEntry[] = [];
  return [
    {
      name: 'plugin-prebundle',
      enforce: 'pre',
      config() {
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
                    return `pre-bundle-chunk-[name]-[hash].mjs`;
                  }
                },
              },
            },
          },
        } as UserConfig;
      },
      async configResolved(cfg) {
        const rootDir = cfg.root;
        projectImports = uniq([
          ...(await findProjectImports(rootDir, pluginOpt.exclude ?? [])),
          ...(pluginOpt.include ?? []),
        ]);
        console.table(projectImports);
      },
      async buildStart(options) {
        for (const chunk of projectImports) {
          const outputFile = this.emitFile({
            id: chunk,
            name: `pre-bundle-${makeIdentifierFromModuleId(chunk)}`,
            type: 'chunk',
          });
          preBundleEntries.push({
            moduleId: chunk,
            moduleFilePath: outputFile,
            exports: [],
            isCommonJS: false,
          });
        }
      },
      resolveId: {
        order: 'pre',
        handler(source) {
          if (source.endsWith(FAKE_ENTRY)) {
            return {
              id: FAKE_ENTRY,
            };
          }
          return null;
        },
      },
      load(id) {
        if (id === FAKE_ENTRY) {
          return '';
        }
        return null;
      },
      generateBundle: {
        order: 'post',
        async handler(options, chunkMap) {
          delete chunkMap['do_not_emit_this_file.mjs'];
          const entries: PreBundleEntry[] = [];
          for (const entry of preBundleEntries) {
            const updated: PreBundleEntry = {
              ...entry,
              moduleFilePath: this.getFileName(entry.moduleFilePath),
            };
            const resolution = await this.resolve(entry.moduleId, undefined, {
              isEntry: false,
            });
            if (!resolution) {
              this.warn(`Cannot resolve ${entry.moduleId}`);
              continue;
            }
            const moduleInfo = this.getModuleInfo(resolution.id);
            if (moduleInfo) {
              updated.exports = moduleInfo.exports ?? [];
              updated.isCommonJS = get(
                moduleInfo.meta,
                'commonjs.isCommonJS',
                false,
              );
            } else {
              this.warn(`Cannot find module info for ${entry.moduleId}`);
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
  ];
}

const findProjectImports = async (
  directoryPath: string,
  blockList: RegExp[],
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
      .filter(([, cnt]) => cnt > 1)
      .map(([id]) => id)
      .filter(
        (it) =>
          !it.startsWith('~') && !it.startsWith('.') && !it.endsWith('.css'),
      );
  } catch (error) {
    throw new Error(`Error reading files: ${error}`);
  }
};
