'use strict';

// @see https://github.com/gitKrystan/prettier-plugin-ember-template-tag/issues/38

module.exports = {
  printWidth: 160,
  singleQuote: true,
  plugins: ['prettier-plugin-ember-template-tag'],
  overrides: [
    {
      files: '*.hbs',
      options: {
        parser: 'glimmer',
        singleQuote: false,
      },
    },
    {
      files: '*.gjs',
      options: {
        parser: 'ember-template-tag',
      },
    },
    {
      files: '*.gts',
      options: {
        parser: 'ember-template-tag',
      },
    },
  ],
};
