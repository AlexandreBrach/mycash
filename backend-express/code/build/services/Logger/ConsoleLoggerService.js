"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConsoleLoggerService = void 0;
const interface_1 = require("./interface");
const getConsoleLoggerService = (level) => {
    const out = (data, outLevel = interface_1.OutputLevel.LOG) => {
        const subject = typeof data === 'function' ? data() : data;
        switch (outLevel) {
            case interface_1.OutputLevel.WARNING:
                console.warn(subject);
                break;
            case interface_1.OutputLevel.LOG:
                console.log(subject);
                break;
            case interface_1.OutputLevel.ERROR:
            default:
                console.error(subject);
        }
    };
    const debug = (data) => {
        if (level >= interface_1.LogLevel.DEBUG) {
            out(data, interface_1.OutputLevel.LOG);
        }
    };
    const info = (data) => {
        if (level >= interface_1.LogLevel.INFO) {
            out(data, interface_1.OutputLevel.LOG);
        }
    };
    const notice = (data) => {
        if (level >= interface_1.LogLevel.NOTICE) {
            out(data, interface_1.OutputLevel.LOG);
        }
    };
    const warning = (data) => {
        if (level >= interface_1.LogLevel.WARNING) {
            out(data, interface_1.OutputLevel.WARNING);
        }
    };
    const error = (data) => {
        if (level >= interface_1.LogLevel.ERROR) {
            out(data, interface_1.OutputLevel.ERROR);
        }
    };
    return {
        debug: debug,
        info: info,
        notice: notice,
        warning: warning,
        error: error,
        log: (data, level = interface_1.LogLevel.INFO) => {
            switch (level) {
                case interface_1.LogLevel.DEBUG:
                    debug(data);
                    break;
                case interface_1.LogLevel.INFO:
                    info(data);
                    break;
                case interface_1.LogLevel.NOTICE:
                    notice(data);
                    break;
                case interface_1.LogLevel.WARNING:
                    warning(data);
                    break;
                case interface_1.LogLevel.ERROR:
                default:
                    error(data);
                    break;
            }
        },
    };
};
exports.getConsoleLoggerService = getConsoleLoggerService;
