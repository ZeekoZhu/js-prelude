/// <reference types='vitest' />
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';
import { preBundle } from '@zeeko/vite-plugin-prebundle';
import { defineConfig } from 'vite';

import prebundleModules from './prebundle-modules.json';

export default defineConfig((env) => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/dll-example-prebundle',
  plugins: [
    react(),
    nxViteTsPaths(),
    preBundle({
      include: [
        ...prebundleModules,
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-virtualized',
      ],
      exclude: [/@babel/],
      merge: {
        antdIcons: ['@ant-design/icons'],
        reactComponents: ['rc-', '@rc-component/'],
        dayjs: ['dayjs'],
      },
    }),
  ],

  resolve: {
    alias: [
      {
        find: /^react-virtualized$/,
        replacement: 'react-virtualized/dist/umd/react-virtualized.js',
      },
    ],
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(env.mode),
  },
  // avoid copy favicon to prebundle output
  publicDir: false,
  build: {
    outDir: '../../dist/apps/dll-example-prebundle',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        experimentalMinChunkSize: 1000 * 1024,
      },
    },
  },
}));
