import { setApplication } from '@ember/test-helpers';
import * as QUnit from 'qunit';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';

import Application from '@3dlayermaker/device-controller-frontend/app';
import config from '@3dlayermaker/device-controller-frontend/config/environment';

setApplication(Application.create(config.APP));

setup(QUnit.assert);

start();
