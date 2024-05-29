'use strict';

module.exports = {
  /**
    Ember CLI sends analytics information by default. The data is completely
    anonymous, but there are times when you might want to disable this behavior.

    Setting `disableAnalytics` to true will prevent any data from being sent.
  */
  disableAnalytics: false,

  /**
  Setting `isTypeScriptProject` to true will force the blueprint generators to generate TypeScript
  rather than JavaScript by default, when a TypeScript version of a given blueprint is available.
  */
  isTypeScriptProject: true,

  packageManager: 'pnpm',

  liveReload: true,
  'live-reload-host': '127.0.0.1',
  'live-reload-port': 49153,
  port: 4208,
};
