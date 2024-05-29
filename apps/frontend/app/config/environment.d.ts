/**
 * Type declarations for
 *    import config from '@3dlayermaker/device-controller-frontend/config/environment'
 */
declare const config: {
  environment: string;
  modulePrefix: string;
  podModulePrefix: string;
  locationType: 'history' | 'hash' | 'none' | 'auto';
  rootURL: string;
  APP: Record<string, unknown>;

  'ember-cli-app-version': {
    version: string;
  };
};

export default config;
