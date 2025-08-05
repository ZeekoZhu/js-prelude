/// <reference types='vitest' />
import { defineConfig, Plugin } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

function tampermonkeyHeader(): Plugin {
  return {
    name: 'tampermonkey-header',
    generateBundle(options, bundle) {
      const fileName = 'rewrite-it.user.iife.js';
      if (bundle[fileName] && bundle[fileName].type === 'chunk') {
        const chunk = bundle[fileName];
        const header = `// ==UserScript==
// @name         Rewrite It
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Rewrite content on web pages
// @author       Zeeko
// @match        *://*/*
// @grant        none
// ==/UserScript==

`;
        chunk.code = header + chunk.code;
      }
    },
  };
}

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/rewrite-it',

  plugins: [nxViteTsPaths(), tampermonkeyHeader()],

  build: {
    outDir: '../../dist/apps/rewrite-it',
    emptyOutDir: true,
    reportCompressedSize: false,
    lib: {
      entry: 'src/main.ts',
      name: 'RewriteIt',
      fileName: 'rewrite-it.user',
      formats: ['iife'],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },

  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/rewrite-it',
      provider: 'v8',
    },
  },
});
