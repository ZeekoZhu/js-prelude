const { mergeConfig } = require('vite');
const viteTsConfigPaths = require('vite-tsconfig-paths').default;

module.exports = {
  core: { builder: '@storybook/builder-vite' },
  stories: [
    '../src/docs/**/*.stories.mdx',
    '../src/docs/**/*.stories.tsx',
    '../src/lib/**/*.stories.mdx',
    '../src/lib/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: ['@storybook/addon-essentials'],
  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      plugins: [
        viteTsConfigPaths({
          root: '../',
        }),
      ],
    });
  },
};
