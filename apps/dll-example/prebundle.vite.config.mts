/// <reference types='vitest' />
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';
import { preBundle } from '@zeeko/unplugin-dll/plugin-prebundle';
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/dll-example-prebundle',
  plugins: [
    react(),
    nxViteTsPaths(),
    preBundle({ include: ['react', 'react-dom', 'react/jsx-runtime'] }),
  ],

  // avoid copy favicon to prebundle output
  publicDir: false,
  build: {
    outDir: '../../dist/apps/dll-example-prebundle',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
