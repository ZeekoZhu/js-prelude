import type { UnpluginFactory } from 'unplugin';
import { createUnplugin } from 'unplugin';

export const unpluginFactory: UnpluginFactory<undefined> = (options) => ({
  name: 'unplugin-dll',
  rollup: {
    name: 'unplugin-dll',
    resolveId: {
      order: 'post',
      async handler(source, importer, options) {
        console.log('unplugin-dll');
        const resolvedId = await this.resolve(source, importer, options);
        this.warn(
          `resolveId: ${resolvedId} ${source} ${importer} ${JSON.stringify(
            options,
          )}`,
        );
        return null;
      },
    },
  },
});

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;
export { PreBundleEntry } from './types';
export { PrebundleOptions } from './types';
