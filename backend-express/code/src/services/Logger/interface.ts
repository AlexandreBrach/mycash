export enum LogLevel {
  DEBUG = 4,
  INFO = 3,
  NOTICE = 2,
  WARNING = 1,
  ERROR = 0,
}

export enum OutputLevel {
  LOG = 0,
  WARNING = 1,
  ERROR = 2,
}

export type Loggable = any | (() => any);

export interface LoggerServiceInterface {
  debug: (data: Loggable) => void;
  info: (data: Loggable) => void;
  notice: (data: Loggable) => void;
  warning: (data: Loggable) => void;
  error: (data: Loggable) => void;
  log: (data: Loggable, level: LogLevel) => void;
}
