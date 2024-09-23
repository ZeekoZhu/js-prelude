import { set } from 'lodash-es';
import { TransformPluginContext } from 'rollup';
import { Plugin } from 'vite';

import { prebundleReferenceEsbuildPlugin } from './prebundle-esbuild';
import { PreBundleReferenceManager } from './prebundle-reference-manager';
import { transformCjsImport } from './transform-cjs-import';

import { PrebundleReferencePluginOptions } from './types';
import { PLUGIN_NAME } from './utils';

export function prebundleReference(
  pluginOptions: PrebundleReferencePluginOptions,
): Plugin[] {
  const dllReferenceManager = new PreBundleReferenceManager(
    pluginOptions.manifest,
    '/prebundle',
  );
  let isDev = false;
  return [
    {
      name: PLUGIN_NAME,
      config: {
        order: 'post',
        handler(config) {
          config.optimizeDeps!.include = config.optimizeDeps?.include?.filter(
            (it) =>
              ![
                'react',
                'react/jsx-runtime',
                'react/jsx-dev-runtime',
                'react-dom',
              ].includes(it),
          );
          config.optimizeDeps!.exclude =
            dllReferenceManager.getPreBundleModules();
          set(config, 'optimizeDeps.esbuildOptions.plugins', [
            prebundleReferenceEsbuildPlugin({
              refManager: dllReferenceManager,
            }),
          ]);
          return config;
        },
      },
      configResolved: (config) => {
        isDev = config.command === 'serve';
      },
      buildStart: {
        async handler() {
          if (isDev) {
            return;
          }
          const chunks = await dllReferenceManager.getPreBundleFiles();
          chunks.forEach((chunk) => {
            this.emitFile({ ...chunk, type: 'prebuilt-chunk' });
          });
        },
      },
      resolveId: {
        order: 'pre',
        handler(source, importer, option) {
          const prebundle = dllReferenceManager.getPreBundledModule(source);
          if (prebundle) {
            return {
              id: isDev
                ? dllReferenceManager.getPrebundleImportFsPath(prebundle)
                : dllReferenceManager.getPreBundleImportPath(prebundle),
              external: true,
            };
          }
          return null;
        },
      },
      transform: {
        handler(code, id) {
          return transformCjsImport.call(
            this as TransformPluginContext,
            dllReferenceManager,
            code,
            id,
          );
        },
      },
    },
  ];
}
