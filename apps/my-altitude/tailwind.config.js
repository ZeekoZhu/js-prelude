const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['retro'],
          primary: '#86A788',
          'primary-content': '#FFFDEC',
          secondary: '#D9B8A3',
          'secondary-content': '#6A4F3B',
          'accent-teal': '#4C7B82',
          'accent-teal-content': '#FFFFFF',
          accent: '#B35E38',
          'accent-content': '#FFFDEC',
        },
      },
    ],
  },
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui'), require('@tailwindcss/typography')],
};
