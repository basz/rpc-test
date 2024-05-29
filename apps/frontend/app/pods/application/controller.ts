import Controller from '@ember/controller';
import { SocketActions } from '@3dlayermaker/common/moonraker';

export default class ApplicationController extends Controller {
  constructor() {
    super(...arguments);

    new SocketActions({ url: 'ws://localhost:7125' });
  }
}
