/// <reference types='vitest' />
import { defineConfig, Plugin } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

function tampermonkeyHeader(): Plugin {
  let mode = 'production';

  return {
    name: 'tampermonkey-header',
    config(_config, { mode: configMode }) {
      mode = configMode;
    },
    generateBundle(_options, bundle) {
      const fileName = 'rewrite-it.user.js';
      if (bundle[fileName] && bundle[fileName].type === 'chunk') {
        const chunk = bundle[fileName];
        const isDev = mode === 'development';
        const version = isDev ? `1.0.${Date.now()}` : '1.0';
        const header = `// ==UserScript==
// @name         Rewrite It
// @namespace    http://tampermonkey.net/
// @version      ${version}
// @description  Rewrite content on web pages
// @author       Zeeko
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_notification
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
      fileName: () => 'rewrite-it.user.js',
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
