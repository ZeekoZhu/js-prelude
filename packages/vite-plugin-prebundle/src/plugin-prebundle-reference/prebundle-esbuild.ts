import { createEsbuildPlugin, UnpluginFactory } from 'unplugin';

import { PreBundleReferenceManager } from './prebundle-reference-manager';
import { transformCjsImport } from './transform-cjs-import';
import { PLUGIN_NAME } from './utils';

export interface PrebundleReferenceEsbuildPluginOptions {
  refManager: PreBundleReferenceManager;
}

const prebundleReferencePluginEsbuildFactory: UnpluginFactory<
  PrebundleReferenceEsbuildPluginOptions
> = ({ refManager }) => ({
  name: PLUGIN_NAME,
  resolveId(id) {
    const prebundle = refManager.getPreBundledModule(id);
    if (prebundle) {
      return {
        id: refManager.getPrebundleImportFsPath(prebundle),
        external: true,
      };
    }
    return null;
  },
  transform(code, id) {
    return transformCjsImport.call(this, refManager, code, id);
  },
  esbuild: {
    onResolveFilter: /.*\.(tsx|ts|jsx|js)/,
    onLoadFilter: /.*\.(tsx|ts|jsx|js|mjs|mts|mtsx|mjsx|cjs)/,
  },
});

/**
 * transform named import from pre-bundled commonjs module to default import
 */
export const prebundleReferenceEsbuildPlugin = createEsbuildPlugin(
  prebundleReferencePluginEsbuildFactory,
);
