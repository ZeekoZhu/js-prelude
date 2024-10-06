import { concat, set, uniq } from 'lodash-es';
import { TransformPluginContext } from 'rollup';
import { Plugin } from 'vite';

import { prebundleReferenceEsbuildPlugin } from './prebundle-esbuild';
import { PLUGIN_BUNDLE_HELPER, pluginBundleHelper } from './prebundle-helper';
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
          const preBundleModules = dllReferenceManager.getPreBundleModules();
          config.optimizeDeps!.include = config.optimizeDeps?.include?.filter(
            (it) => !preBundleModules.includes(it),
          );
          config.optimizeDeps!.exclude = uniq(
            concat(config.optimizeDeps?.exclude, preBundleModules).filter(
              (it) => it != null,
            ),
          );
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
          if (source === PLUGIN_BUNDLE_HELPER) {
            return PLUGIN_BUNDLE_HELPER;
          }
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
      load(id) {
        if (id === PLUGIN_BUNDLE_HELPER) {
          return pluginBundleHelper;
        }
        return null;
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
