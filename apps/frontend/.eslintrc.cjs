'use strict';

const { configs } = require('@nullvoxpopuli/eslint-configs');

const config = configs.ember();

module.exports = {
  ...config,
  overrides: [
    ...config.overrides,
    {
      files: ['**/*.{t,gt}s'],
      rules: {
        /**
         * any can be useful
         */
        '@typescript-eslint/no-explicit-any': 'off',
        /**
         * The following types do are not defined by the definitely typed packages
         * - @glimmer/tracking/primitives/cache
         *   - getValue
         * - @ember/helper
         *   - invokeHelper
         *   - capabilities
         *   - setHelperManager
         */
        '@typescript-eslint/ban-ts-comment': 'off',

        'ember/use-ember-data-rfc-395-imports': 'warn',
      },
    },
    {
      files: ['**/*.{j,cj}s'],
      rules: {
        'n/no-unpublished-require': [
          'error',
          {
            allowModules: [
              '@nullvoxpopuli/eslint-configs',
              'dotenv',
              'ember-cli',
              'postcss-scss',
              '@csstools/postcss-sass',
              'autoprefixer',
              'tailwindcss',
              '@embroider/webpack',
              '@embroider/compat',
            ],
          },
        ],
      },
    },
  ],
};
