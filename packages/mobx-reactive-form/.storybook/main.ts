import { dirname, join } from 'path';
import { mergeConfig } from 'vite';
import viteTsconfig from 'vite-tsconfig-paths';

const tsconfigPaths = viteTsconfig;

module.exports = {
  stories: [
    '../src/docs/**/*.stories.mdx',
    '../src/docs/**/*.stories.tsx',
    '../src/lib/**/*.stories.mdx',
    '../src/lib/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-mdx-gfm'),
    getAbsolutePath('@storybook/addon-mdx-gfm'),
  ],
  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      plugins: [
        tsconfigPaths({
          root: './',
        }),
      ],
    });
  },
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
  },
  docs: {
    autodocs: true,
  },
};
/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')));
}
