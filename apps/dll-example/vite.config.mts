/// <reference types='vitest' />
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';
import { prebundleReference } from '@zeeko/unplugin-dll';
import { defineConfig } from 'vite';
import { path } from 'zx';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/dll-example',

  server: {
    port: 4200,
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    react(),
    nxViteTsPaths(),
    prebundleReference({
      manifest: path.resolve(
        __dirname,
        '../../dist/apps/dll-example-prebundle/pre-bundle-manifest.json',
      ),
    }),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  build: {
    outDir: '../../dist/apps/dll-example',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
