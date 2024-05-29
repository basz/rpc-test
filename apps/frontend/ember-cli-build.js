'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
// const path = require('path');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    // see https://github.com/embroider-build/ember-auto-import?tab=readme-ov-file#customizing-build-behavior
    autoImport: {
      watchDependencies: ['@3dlayermaker/common'],
      webpack: {},
    },
    babel: {
      plugins: [
        [
          '@babel/plugin-transform-typescript',
          {
            allowDeclareFields: true,
            allExtensions: true,
            onlyRemoveTypeImports: true,
          },
        ],
      ],
    },
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  // ember-data >4.7 is not compatible with embroider
  // return app.toTree();

  const { Webpack } = require('@embroider/webpack');

  return require('@embroider/compat').compatBuild(app, Webpack, {
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
  });
};
