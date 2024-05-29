'use strict';

module.exports = {
  singleQuote: true,
  printWidth: 160,
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
      files: '*.{js,ts,gjs,gts}',
      options: {
        templateSingleQuote: false,
      },
    },
  ],
};
