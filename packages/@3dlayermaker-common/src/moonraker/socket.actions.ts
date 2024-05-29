import { EventEmitter } from 'eventemitter3';
import { Client as WebSocketClient } from 'rpc-websockets';

import type { ResultObject } from '../util/settle';
import type { ApiCredentials, IdentifyConnectionResult } from './types';

export class SocketActions {
  private logger: any;
  private ws: WebSocketClient;

  private eventEmitter = new EventEmitter();

  constructor({ url, logger }: { url: string; logger?: any }) {
    this.logger = logger;

    this.ws = this.createConnection(url);
  }

  private createConnection(url: string) {
    let ws = new WebSocketClient(url, { reconnect: true, autoconnect: true, max_reconnects: 5, reconnect_interval: 3000 });
    let connectAttempts = 0;

    this.eventEmitter.emit('connecting');

    ws.on('open', async () => {
      connectAttempts = 0;
      this.eventEmitter.emit('connectionOpened');
      //this.logger?.debug('opened web socket');
    });

    ws.on('close', (code: number, reason: Buffer) => {
      connectAttempts = 0;
      this.logger?.debug(`Websocket closed with code: ${code} and reason: ${reason?.toString()}`);
      this.eventEmitter.emit('connectionClosed');
    });

    // Emitted when an error occurs. Errors may have a .code property, matching one of the string values defined below under Error codes.
    // https://github.com/websockets/ws/blob/master/doc/ws.md#error-codes
    ws.on('error', (event: ErrorEvent) => {
      const target = event.target as WebSocket;

      switch (target.readyState) {
        case target.CLOSED:
          connectAttempts++;

          if (connectAttempts >= 5) {
            this.logger?.info('too many attempts');
            this.eventEmitter.emit('connectionFailed');
            ws = null;

            return;
          }

          break;
        default:
          this.logger?.error(event?.message ?? event);
          this.eventEmitter.emit('error', event);
      }
    });

    return ws;
  }

  public on(event: string, listener: (...args: any[]) => void) {
    this.eventEmitter.on(event, listener);
  }

  public off(event: string, listener: (...args: any[]) => void) {
    this.eventEmitter.off(event, listener);
  }

  public close() {
    this.ws.close();
  }

  private async call<T>(method: string, params: any = undefined): Promise<ResultObject<T>> {
    try {
      return { result: (await this.ws.call(method, params)) as T };
    } catch (error) {
      this.logger?.error(['error for call: ' + method, error]);

      return { error };
    }
  }

  public async wsAuthenticate(credentials: ApiCredentials) {
    const { result, error } = await this.identifyConnection<IdentifyConnectionResult>({
      clientName: 'controller',
      version: '0.0.1',
      type: 'other',
      url: 'http://github.com/iSole-3D',
      accessToken: credentials?.accessToken,
      apiKey: credentials?.apiKey,
    });

    if (error) {
      this.eventEmitter.emit('connectionAuthenticationFailed');
    } else {
      //  this.logger?.debug(`authenticated with moonraker: ${result.connection_id}`);
      this.eventEmitter.emit('connectionAuthenticated');
    }
  }

  public wsSubscribe(event: string) {
    this.ws.subscribe(event);
  }

  public wsUnsubscribe(event: string) {
    this.ws.unsubscribe(event);
  }

  public wsOn(event: string, callback: (...args: any[]) => void) {
    this.ws.on(event, callback);
  }

  public wsOnce(event: string, callback: (...args: any[]) => void) {
    this.ws.once(event, callback);
  }

  public wsOff(event: string, callback: (...args: any[]) => void) {
    this.ws.off(event, callback);
  }

  /**
   * JSON-RPC requests for Server Administration
   */

  // @see https://moonraker.readthedocs.io/en/latest/web_api/#query-server-info
  async serverInfo<T>(): Promise<ResultObject<T>> {
    return await this.call('server.info');
  }

  // @see https://moonraker.readthedocs.io/en/latest/web_api/#get-server-configuration
  async serverConfig<T>(): Promise<ResultObject<T>> {
    return await this.call('server.config');
  }

  // @see https://moonraker.readthedocs.io/en/latest/web_api/#request-cached-temperature-data
  async serverTemperatureStore<T>(includeMonitors: boolean = false): Promise<ResultObject<T>> {
    return await this.call('server.temperature_store', { include_monitors: includeMonitors });
  }

  // @see https://moonraker.readthedocs.io/en/latest/web_api/#request-cached-gcode-responses
  async getCachedGCodeResponses<T>(count?: number): Promise<ResultObject<T>> {
    return await this.call('server.gcode_store', { count });
  }

  // @see https://moonraker.readthedocs.io/en/latest/web_api/#rollover-logs
  async rolloverLogs<T>(application?: string): Promise<ResultObject<T>> {
    return await this.call('server.logs.rollover', { application });
  }

  // @see https://moonraker.readthedocs.io/en/latest/web_api/#restart-server
  async serverRestart<T>(): Promise<ResultObject<T>> {
    return await this.call('server.restart');
  }

  // @see https://moonraker.readthedocs.io/en/latest/web_api/#identify-connection
  async identifyConnection<T>({
    clientName,
    version,
    type,
    url,
    accessToken,
    apiKey,
  }: {
    clientName: string;
    version: string;
    type: string;
    url: string;
    accessToken?: string;
    apiKey?: string;
  }): Promise<ResultObject<T>> {
    return await this.call('server.connection.identify', {
      client_name: clientName,
      version: version,
      type: type,
      url: url,
      access_token: accessToken,
      api_key: apiKey,
    });
  }

  /**
   * JSON-RPC requests for Printer Administration
   */

  async getKlippyHostInfo<T>(): Promise<ResultObject<T>> {
    return await this.call('printer.info');
  }

  // Emergency Stop
  async printerEmergencyStop<T>(): Promise<ResultObject<T>> {
    return await this.call('printer.emergency_stop');
  }

  // Host Restart
  async printerRestart<T>(): Promise<ResultObject<T>> {
    return await this.call('printer.restart');
  }

  // Firmware Restart
  async printerFirmwareRestart<T>(): Promise<ResultObject<T>> {
    return await this.call('printer.firmware_restart');
  }

  /**
   * JSON-RPC requests for Printer Status Api
   */

  // List available printer objects
  // @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#list-available-printer-objects)
  async listPrinterObjects<T>(): Promise<ResultObject<T>> {
    return await this.call('printer.objects.list');
  }

  // Query printer object status
  // @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#query-printer-object-status)
  async queryPrinterObjectStatus<T>(objects: { [key: string]: any }): Promise<ResultObject<T>> {
    return await this.call('printer.objects.query', { objects });
  }

  // Subscribe to printer object status
  // @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#subscribe-to-printer-object-status)
  async subscribePrinterObjectStatus<T>(objects: { [key: string]: any }): Promise<ResultObject<T>> {
    return await this.call('printer.objects.subscribe', { objects });
  }

  // Query Endstops
  // @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#query-endstops)
  async queryEndstops<T>(): Promise<ResultObject<T>> {
    return await this.call('printer.query_endstops.status');
  }

  /**
   * JSON-RPC requests for GCode Api
   */

  // Run a GCode
  // @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#run-a-gcode)
  async runGCode<T>(gcode: string): Promise<ResultObject<T>> {
    return await this.call('printer.gcode.script', { script: gcode });
  }

  // Get GCode Help
  // @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#get-gcode-help)
  async getGCodeHelp<T>(command: string): Promise<ResultObject<T>> {
    return await this.call('printer.gcode.help', { command });
  }

  /**
   * JSON-RPC requests for Print Managenent
   */

  // print a file
  // @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#print-a-file)
  async startPrint<T>(filename: string): Promise<ResultObject<T>> {
    return await this.call('printer.print.start', { filename });
  }

  // pause a print
  // @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#pause-a-print)
  async pausePrint<T>(): Promise<ResultObject<T>> {
    return await this.call('printer.print.pause');
  }

  // resume a print
  // @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#resume-a-print)
  async resumePrint<T>(): Promise<ResultObject<T>> {
    return await this.call('printer.print.resume');
  }

  // cancel a print
  // @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#cancel-a-print)
  async cancelPrint<T>(): Promise<ResultObject<T>> {
    return await this.call('printer.print.cancel');
  }

  /**
   * JSON-RPC requests for File Operations
   */

  // List available files
  // @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#list-available-files)
  async listAvailableFiles<T>(rootFolder?: string): Promise<ResultObject<T>> {
    return await this.call('server.files.list', { root: rootFolder });
  }

  // List registered roots
  // @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#list-registered-roots)
  async listRegisteredRoots<T>(): Promise<ResultObject<T>> {
    return await this.call('server.files.roots', {});
  }

  // Get GCode Metadata
  // @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#get-gcode-metadata)
  async getGCodeMetadata<T>(filename: string): Promise<ResultObject<T>> {
    return await this.call('server.files.metadata', { filename });
  }

  // Scan GCode Metadata
  // @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#scan-gcode-metadata)
  async scanGCodeMetadata<T>(filename: string): Promise<ResultObject<T>> {
    return await this.call('server.files.metascan', { filename });
  }

  // Get GCode Thumbnails
  // @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#get-gcode-thumbnails)
  async getGCodeThumbnails<T>(filename: string): Promise<ResultObject<T>> {
    return await this.call('server.files.thumbnails', { filename });
  }

  // Get directory information
  // @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#get-directory-information)
  async getDirectoryInformation<T>(path: string, extended: boolean = false): Promise<ResultObject<T>> {
    return await this.call('server.files.get_directory', { path, extended });
  }

  // Create directory
  // @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#create-directory)
  async createDirectory<T>(path: string): Promise<ResultObject<T>> {
    return await this.call('server.files.post_directory', { path });
  }

  // Delete directory
  // @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#delete-directory)
  async deleteDirectory<T>(path: string, force: boolean = false): Promise<ResultObject<T>> {
    return await this.call('server.files.delete_directory', { path, force });
  }

  // Move a file or directory
  // @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#move-a-file-or-directory)
  async moveFileOrDirectory<T>(source: string, dest: string): Promise<ResultObject<T>> {
    return await this.call('server.files.move', { source, dest });
  }

  // Copy a file or directory
  // @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#copy-a-file-or-directory)
  async copyFileOrDirectory<T>(source: string, dest: string): Promise<ResultObject<T>> {
    return await this.call('server.files.copy', { source, dest });
  }

  // Create a ZIP archive
  // @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#create-a-zip-archive)
  async createZipArchive<T>(dest: string, items: string[], storeOnly: boolean = false): Promise<ResultObject<T>> {
    return await this.call('server.files.zip', { dest, items, store_only: storeOnly });
  }

  // File delete
  // @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#file-delete)
  async deleteFile<T>(root: string, filename: string): Promise<ResultObject<T>> {
    return await this.call('server.files.delete_file', { path: `${root}/${filename}` });
  }

  // Download Klippy.log
  // @see https://moonraker.readthedocs.io/en/latest/web_api/#download-klippy-log
  // n/a

  // Download moonraker.log
  // @see https://moonraker.readthedocs.io/en/latest/web_api/#download-moonraker-log
  // n/a

  /**
   * JSON-RPC requests for Authorization APIs
   */

  // Login User
  // @see https://moonraker.readthedocs.io/en/latest/web_api/#login-user
  async loginUser<T>(username: string, password: string, source: string = 'moonraker'): Promise<ResultObject<T>> {
    return await this.call('access.login', { username, password, source });
  }

  // Logout Current User
  // @see https://moonraker.readthedocs.io/en/latest/web_api/#logout-current-user
  async logoutUser<T>(): Promise<ResultObject<T>> {
    return await this.call('access.logout', {});
  }

  // Get Current User
  // @see https://moonraker.readthedocs.io/en/latest/web_api/#get-current-user
  async getCurrentUser<T>(): Promise<ResultObject<T>> {
    return await this.call('access.get_user', {});
  }

  // Create User
  // @see https://moonraker.readthedocs.io/en/latest/web_api/#create-user
  async createUser<T>(username: string, password: string): Promise<ResultObject<T>> {
    return await this.call('access.post_user', { username, password });
  }

  // Delete User
  // @see https://moonraker.readthedocs.io/en/latest/web_api/#delete-user
  async deleteUser<T>(username: string): Promise<ResultObject<T>> {
    return await this.call('access.delete_user', { username });
  }

  // List Available Users
  // @see https://moonraker.readthedocs.io/en/latest/web_api/#list-available-users
  async listUsers<T>(): Promise<ResultObject<T>> {
    return await this.call('access.users.list', {});
  }

  // Reset User Password
  // @see https://moonraker.readthedocs.io/en/latest/web_api/#reset-user-password
  async resetUserPassword<T>(password: string, newPassword: string): Promise<ResultObject<T>> {
    return await this.call('access.user.password', { password, newPassword });
  }

  // Refresh JSON Web Token
  // @see https://moonraker.readthedocs.io/en/latest/web_api/#refresh-json-web-token
  async refreshJWT<T>(refreshToken: string): Promise<ResultObject<T>> {
    return await this.call('access.refresh_jwt', { refresh_token: refreshToken });
  }

  // Generate a Oneshot Token
  // @see https://moonraker.readthedocs.io/en/latest/web_api/#generate-a-oneshot-token
  async generateOneshotToken<T>(): Promise<ResultObject<T>> {
    return await this.call('access.oneshot_token', {});
  }

  // Retrieve information about authorization endpoints
  // @see https://moonraker.readthedocs.io/en/latest/web_api/#retrieve-information-about-authorization-endpoints
  async getAuthorizationInfo<T>(): Promise<ResultObject<T>> {
    return await this.call('access.info', {});
  }

  // Get the Current API Key
  // @see https://moonraker.readthedocs.io/en/latest/web_api/#get-the-current-api-key
  async getCurrentApiKey<T>(): Promise<ResultObject<T>> {
    return await this.call('access.get_api_key', {});
  }

  // Generate a New API Key
  // @see https://moonraker.readthedocs.io/en/latest/web_api/#generate-a-new-api-key
  async generateNewApiKey<T>(): Promise<ResultObject<T>> {
    return await this.call('access.post_api_key', {});
  }

  /**
   * JSON-RPC requests for Job Queue APIs
   */

  // Retrieve the job queue status
  // @see https://moonraker.readthedocs.io/en/latest/web_api/#retrieve-the-job-queue-status
  async retrieveJobQueueStatus<T>(): Promise<ResultObject<T>> {
    return await this.call('server.job_queue.status', {});
  }

  // Enqueue a job
  // @see https://moonraker.readthedocs.io/en/latest/web_api/#enqueue-a-job
  async enqueueJob<T>(filenames: string[], reset: boolean = false): Promise<ResultObject<T>> {
    return await this.call('server.job_queue.post_job', { filenames, reset });
  }

  // Remove a job
  // @see https://moonraker.readthedocs.io/en/latest/web_api/#remove-a-job
  async removeJob<T>(jobIds: string[]): Promise<ResultObject<T>> {
    return await this.call('server.job_queue.delete_job', { job_ids: jobIds });
  }

  // Pause the job queue
  // @see https://moonraker.readthedocs.io/en/latest/web_api/#pause-the-job-queue
  async pauseJobQueue<T>(): Promise<ResultObject<T>> {
    return await this.call('server.job_queue.pause', {});
  }

  // Start the job queue
  // @see https://moonraker.readthedocs.io/en/latest/web_api/#start-the-job-queue
  async startJobQueue<T>(): Promise<ResultObject<T>> {
    return await this.call('server.job_queue.start', {});
  }

  // Jump a job to the front of the queue
  // @see https://moonraker.readthedocs.io/en/latest/web_api/#perform-a-queue-jump
  async jumpJobToFront<T>(jobId: string): Promise<ResultObject<T>> {
    return await this.call('server.job_queue.jump', { job_id: jobId });
  }

  /**
   * JSON-RPC requests for History APIs
   */
  // Get job totals
  async getJobTotals<T>(): Promise<ResultObject<T>> {
    return await this.call('server.history.totals');
  }
}
