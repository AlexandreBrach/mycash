"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputLevel = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 4] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 3] = "INFO";
    LogLevel[LogLevel["NOTICE"] = 2] = "NOTICE";
    LogLevel[LogLevel["WARNING"] = 1] = "WARNING";
    LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
var OutputLevel;
(function (OutputLevel) {
    OutputLevel[OutputLevel["LOG"] = 0] = "LOG";
    OutputLevel[OutputLevel["WARNING"] = 1] = "WARNING";
    OutputLevel[OutputLevel["ERROR"] = 2] = "ERROR";
})(OutputLevel = exports.OutputLevel || (exports.OutputLevel = {}));
