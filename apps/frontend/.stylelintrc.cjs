'use strict';

module.exports = {
  extends: ['stylelint-config-recommended', 'stylelint-config-tailwindcss'],
  customSyntax: 'postcss-scss',
};

// module.exports = {
//   plugins: ['stylelint-scss'],
//   extends: ['stylelint-config-standard', 'stylelint-prettier/recommended'],

//   rules: {
//     'at-rule-no-unknown': [
//       true,
//       {
//         ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen'],
//       },
//     ],
//     'declaration-block-trailing-semicolon': null,
//     'no-descending-specificity': null,
//   },
// };
