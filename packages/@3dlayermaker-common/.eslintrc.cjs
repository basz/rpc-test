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
         * This one is incorrectly parsed for now, because
         * the rule doesn't understand decorators
         */
        '@typescript-eslint/no-unused-vars': 'off',
        /**
         * any can be useful
         */
        '@typescript-eslint/no-explicit-any': 'off',
        /**
         * there is heavy use of `object` in this library
         */
        '@typescript-eslint/ban-types': 'off',
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
        'ember/no-empty-glimmer-component-classes': 'warn',
      },
    },
    {
      files: ['**/*.{j,cj}s'],
      rules: {
        'n/no-unpublished-require': [
          'error',
          {
            allowModules: ['@nullvoxpopuli/eslint-configs'],
          },
        ],
      },
    },
  ],
};
