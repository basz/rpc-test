export type ApiCredentials = { apiKey: string; accessToken?: never } | { apiKey?: never; accessToken: string };

export type FetchResult = {
  result: ResultResponse;
};

export type ResultResponse = NonNullable<unknown>;

export type GetApiKeyResult = NonNullable<string>;

export type EmergencyResult = NonNullable<'ok'>;

/**
 * Types for Server Administration
 */

// @see https://moonraker.readthedocs.io/en/latest/web_api/#query-server-info
export type ServerInfoResult = {
  klippy_connected: boolean;
  klippy_state: 'ready' | 'shutdown' | 'startup' | 'error';
  components: string[];
  failed_components: string[];
  registered_directories: string[];
  warnings: string[];
  websocket_count: number;
  moonraker_version: string;
  api_version: number[];
  api_version_string: string;
} & ResultResponse;

// @see https://moonraker.readthedocs.io/en/latest/web_api/#get-server-configuration
export type ServerConfigResult = {
  config: any; // Detailed configuration object
  orig: any;
  files: {
    filename: string;
    sections: string[];
  }[];
} & ResultResponse;

// @see https://moonraker.readthedocs.io/en/latest/web_api/#request-cached-temperature-data
export type CachedTemperatureDataResult = {
  [sensorName: string]: {
    temperatures: number[];
    targets?: number[];
    powers?: number[];
    speeds?: number[];
  };
} & ResultResponse;

// Type for the GCode store response
export type CachedGCodeStoreResult = {
  gcode_store: {
    message: string;
    time: number;
    type: 'response' | 'command';
  }[];
} & ResultResponse;

// Type for the logs rollover response
export type LogsRolloverResult = {
  rolled_over: string[];
  failed: { [key: string]: string };
} & ResultResponse;

// Request Cached GCode Responses
// @see https://moonraker.readthedocs.io/en/latest/web_api/#request-cached-gcode-responses
export type GCodeResponseResult = {
  gcode_store: {
    message: string;
    time: number;
    type: string;
  }[];
} & ResultResponse;

// Rollover Logs
// @see https://moonraker.readthedocs.io/en/latest/web_api/#rollover-logs
export type RolloverLogsResult = {
  rolled_over: string[];
  failed: { [key: string]: string };
} & ResultResponse;

// Restart Server
// @see https://moonraker.readthedocs.io/en/latest/web_api/#restart-server
export type ServerRestartResult = NonNullable<'ok'> & ResultResponse;

// Identify connection response
export type IdentifyConnectionResult = {
  connection_id: number;
} & ResultResponse;

/**
 * Types for Printer Administration
 */

// Get Klippy host information
// @see https://moonraker.readthedocs.io/en/latest/web_api/#get-klippy-host-information
export type GetKlippyHostInfoResult = {
  state: string;
  state_message: string;
  hostname: string;
  software_version: string;
  cpu_info: string;
  klipper_path: string;
  python_path: string;
  log_file: string;
  config_file: string;
} & ResultResponse;

// Emergency Stop result type
export type EmergencyStopResult = NonNullable<'ok'> & ResultResponse;

// Host Restart result type
export type HostRestartResult = NonNullable<'ok'> & ResultResponse;

// Firmware Restart result type
export type FirmwareRestartResult = NonNullable<'ok'> & ResultResponse;

/**
 * Types for Printer Status
 */

// List available printer objects
// @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#list-available-printer-objects)
export type ListPrinterObjectsResult = {
  objects: string[];
} & ResultResponse;

// Query printer object status
// @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#query-printer-object-status)
export type QueryPrinterObjectStatusResult = {
  eventtime: number;
  status: any; // Replace 'any' with a more specific type if available
} & ResultResponse;

// Subscribe to printer object status
// @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#subscribe-to-printer-object-status)
export type SubscribePrinterObjectStatusResult = {
  eventtime: number;
  status: any; // Replace 'any' with a more specific type if available
} & ResultResponse;

// Query Endstops
// @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#query-endstops)
export type QueryEndstopsResult = {
  [key: string]: string; // key is the endstop identifier
} & ResultResponse;

/**
 * Types for GCode APIs
 */
// Run a GCode command result type
// @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#run-a-gcode)
export type RunGCodeCommandResult = NonNullable<'ok'> & ResultResponse;

/**
 * Types for Print Managenent APIs
 */

// Start Print result type
// @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#start-print)
export type StartPrintResult = NonNullable<'ok'> & ResultResponse;

// Cancel Print result type
// @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#cancel-print)
export type CancelPrintResult = NonNullable<'ok'> & ResultResponse;

// Pause Print result type
// @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#pause-print)
export type PausePrintResult = NonNullable<'ok'> & ResultResponse;

// Resume Print result type
// @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#resume-print)
export type ResumePrintResult = NonNullable<'ok'> & ResultResponse;

/**
 * Types for File Operations APIs
 */

// List available files result
// @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#list-available-files)
export type ListAvailableFilesResult = {
  path: string;
  modified: number;
  size: number;
  permissions: string;
}[] &
  ResultResponse;

// List registered roots result
// @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#list-registered-roots)
export type ListRegisteredRootsResult = {
  roots: {
    name: string;
    path: string;
    permissions: string;
  }[];
} & ResultResponse;

// GCode Metadata result
// @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#get-gcode-metadata)
export type GCodeMetadataResult = {
  print_start_time: number | null;
  job_id: number | null;
  size: number;
  modified: number;
  slicer: string;
  slicer_version: string;
  layer_height: number;
  first_layer_height: number;
  object_height: number;
  filament_total: number;
  estimated_time: number;
  thumbnails: {
    width: number;
    height: number;
    size: number;
    relative_path: string;
  }[];
  first_layer_bed_temp: number;
  first_layer_extr_temp: number;
  gcode_start_byte: number;
  gcode_end_byte: number;
  filename: string;
} & ResultResponse;

// Directory Information result
// @see [Moonraker Documentation](https://moonraker.readthedocs.io/en/latest/web_api/#get-directory-information)
export type DirectoryInformationResult = {
  dirs: {
    modified: number;
    size: number;
    permissions: string;
    dirname: string;
  }[];
  files: {
    modified: number;
    size: number;
    permissions: string;
    filename: string;
  }[];
  disk_usage: {
    total: number;
    used: number;
    free: number;
  };
  root_info: {
    name: string;
    permissions: string;
  };
} & ResultResponse;

// File Operation result (common for create, move, copy, delete)
export type FileOperationResult = {
  item: {
    root: string;
    path: string;
    modified: number;
    size: number;
    permissions: string;
  };
  action: string;
} & ResultResponse;

// ZIP Archive Creation result
export type ZipArchiveCreationResult = {
  destination: {
    root: string;
    path: string;
    modified: number;
    size: number;
    permissions: string;
  };
  action: string;
} & ResultResponse;

/**
 * Types for Authorization APIs
 */

// Type for login user result
// @see https://moonraker.readthedocs.io/en/latest/web_api/#login-user
export type LoginUserResult = {
  username: string;
  token: string;
  refresh_token: string;
  action: 'user_logged_in';
  source: string;
} & ResultResponse;

// Type for logout current user result
// @see https://moonraker.readthedocs.io/en/latest/web_api/#logout-current-user
export type LogoutUserResult = {
  username: string;
  action: 'user_logged_out';
} & ResultResponse;

// Type for get current user result
// @see https://moonraker.readthedocs.io/en/latest/web_api/#get-current-user
export type GetCurrentUserInfoResult = {
  username: string;
  source: string;
  created_on: number;
} & ResultResponse;

// Type for create user result
// @see https://moonraker.readthedocs.io/en/latest/web_api/#create-user
export type CreateUserResult = {
  username: string;
  token: string;
  refresh_token: string;
  source: string;
  action: 'user_created';
} & ResultResponse;

// Type for delete user result
// @see https://moonraker.readthedocs.io/en/latest/web_api/#delete-user
export type DeleteUserResult = {
  username: string;
  action: 'user_deleted';
} & ResultResponse;

// Type for list available users result
// @see https://moonraker.readthedocs.io/en/latest/web_api/#list-available-users
export type ListUsersResult = {
  users: {
    username: string;
    source: string;
    created_on: number;
  }[];
} & ResultResponse;

// Type for reset user password result
// @see https://moonraker.readthedocs.io/en/latest/web_api/#reset-user-password
export type ResetUserPasswordResult = {
  username: string;
  action: 'user_password_reset';
} & ResultResponse;

// Type for refresh JSON Web Token result
// @see https://moonraker.readthedocs.io/en/latest/web_api/#refresh-json-web-token
export type RefreshJWTResult = {
  username: string;
  token: string;
  source: string;
  action: 'user_jwt_refresh';
} & ResultResponse;

// Type for generate a oneshot token result
// @see https://moonraker.readthedocs.io/en/latest/web_api/#generate-a-oneshot-token
export type GenerateOneshotTokenResult = {
  token: string;
} & ResultResponse;

// Type for retrieve information about authorization endpoints result
// @see https://moonraker.readthedocs.io/en/latest/web_api/#retrieve-information-about-authorization-endpoints
export type GetAuthorizationInfoResult = {
  default_source: string;
  available_sources: string[];
} & ResultResponse;

// Type for get the current API key result
// @see https://moonraker.readthedocs.io/en/latest/web_api/#get-the-current-api-key
export type GetCurrentApiKeyResult = NonNullable<string> & ResultResponse;

// Type for generate a new API key result
// @see https://moonraker.readthedocs.io/en/latest/web_api/#generate-a-new-api-key
export type GenerateNewApiKeyResult = NonNullable<string> & ResultResponse;

/**
 * Types for Job Queue APIs
 */

export type JobQueueJob = {
  filename: string;
  job_id: string;
  time_added: number;
  time_in_queue: number;
};

// Result type for retrieving job queue status
type JobQueueStatusResult = {
  queued_jobs: JobQueueJob[];
  queue_state: 'ready' | 'loading' | 'starting' | 'paused';
} & ResultResponse;

// Result type for retrieve job queue status
// @see https://moonraker.readthedocs.io/en/latest/web_api/#retrieve-the-job-queue-status
export type RetrieveJobQueueStatusResult = JobQueueStatusResult;

// Result type for enqueuing a job
// @see https://moonraker.readthedocs.io/en/latest/web_api/#enqueue-a-job
export type EnqueueJobResult = JobQueueStatusResult;

// Result type for removing a job
// @see https://moonraker.readthedocs.io/en/latest/web_api/#remove-a-job
export type RemoveJobResult = JobQueueStatusResult;

// Result type for pausing the job queue
// @see https://moonraker.readthedocs.io/en/latest/web_api/#pause-the-job-queue
export type PauseJobQueueResult = JobQueueStatusResult;

// Result type for starting the job queue
// @see https://moonraker.readthedocs.io/en/latest/web_api/#start-the-job-queue
export type StartJobQueueResult = JobQueueStatusResult;

// Result type for performing a queue jump
// @see https://moonraker.readthedocs.io/en/latest/web_api/#perform-a-queue-jump
export type JumpJobToFrontResult = JobQueueStatusResult;

/**
 * Types for History APIs
 */

// Get totals
// @see https://moonraker.readthedocs.io/en/latest/web_api/#get-job-totals

// Result type for job totals
export type JobTotalsResult = {
  job_totals: {
    total_jobs: number;
    total_time: number;
    total_print_time: number;
    total_filament_used: number;
    longest_job: number;
    longest_print: number;
  };
} & ResultResponse;
