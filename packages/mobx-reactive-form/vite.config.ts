/// <reference types="vitest" />
import { defineConfig } from 'vite';
import _tsconfigPaths from 'vite-tsconfig-paths';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const tsconfigPaths: typeof _tsconfigPaths = _tsconfigPaths.default;

export default defineConfig({
  server: {
    port: 4200,
    host: 'localhost',
  },
  plugins: [
    tsconfigPaths({
      root: '../../',
    }),
  ],

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
