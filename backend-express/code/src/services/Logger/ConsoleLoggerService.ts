import { Loggable, LoggerServiceInterface, LogLevel, OutputLevel } from './interface';

export const getConsoleLoggerService = (level: LogLevel): LoggerServiceInterface => {
  const out = (data: Loggable, outLevel: OutputLevel = OutputLevel.LOG) => {
    const subject = typeof data === 'function' ? data() : data;
    switch (outLevel) {
      case OutputLevel.WARNING:
        console.warn(subject);
        break;
      case OutputLevel.LOG:
        console.log(subject);
        break;
      case OutputLevel.ERROR:
      default:
        console.error(subject);
    }
  };

  const debug = (data: Loggable) => {
    if (level >= LogLevel.DEBUG) {
      out(data, OutputLevel.LOG);
    }
  };
  const info = (data: Loggable) => {
    if (level >= LogLevel.INFO) {
      out(data, OutputLevel.LOG);
    }
  };
  const notice = (data: Loggable) => {
    if (level >= LogLevel.NOTICE) {
      out(data, OutputLevel.LOG);
    }
  };
  const warning = (data: Loggable) => {
    if (level >= LogLevel.WARNING) {
      out(data, OutputLevel.WARNING);
    }
  };
  const error = (data: Loggable) => {
    if (level >= LogLevel.ERROR) {
      out(data, OutputLevel.ERROR);
    }
  };

  return {
    debug: debug,
    info: info,
    notice: notice,
    warning: warning,
    error: error,
    log: (data: Loggable, level: LogLevel = LogLevel.INFO) => {
      switch (level) {
        case LogLevel.DEBUG:
          debug(data);
          break;
        case LogLevel.INFO:
          info(data);
          break;
        case LogLevel.NOTICE:
          notice(data);
          break;
        case LogLevel.WARNING:
          warning(data);
          break;
        case LogLevel.ERROR:
        default:
          error(data);
          break;
      }
    },
  };
};
