"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLocked = exports.securityException = exports.errorForbidden = exports.errorUnauthorized = exports.errorInvalidParameters = exports.errorNotFound = exports.errorServer = exports.ServiceException = void 0;
const interface_1 = require("../services/Logger/interface");
class ServiceException {
    publicMessage;
    logMessage;
    httpStatus;
    logLevel;
    constructor(publicMessage, logMessage, httpStatus, logLevel) {
        this.publicMessage = publicMessage;
        this.logMessage = logMessage;
        this.httpStatus = httpStatus;
        this.logLevel = logLevel;
    }
}
exports.ServiceException = ServiceException;
const errorServer = (publicMessage, logMessage) => new ServiceException(publicMessage, logMessage ? logMessage : publicMessage, 500, interface_1.LogLevel.ERROR);
exports.errorServer = errorServer;
const errorNotFound = (publicMessage) => new ServiceException(publicMessage, `[NOT FOUND] : ${publicMessage}`, 404, interface_1.LogLevel.INFO);
exports.errorNotFound = errorNotFound;
const errorInvalidParameters = (publicMessage) => new ServiceException(publicMessage, `[INVALID PARAMETERS] : ${publicMessage}`, 400, interface_1.LogLevel.INFO);
exports.errorInvalidParameters = errorInvalidParameters;
const errorUnauthorized = (publicMessage) => new ServiceException(publicMessage, `[UNAUTHORIZED] : ${publicMessage}`, 401, interface_1.LogLevel.INFO);
exports.errorUnauthorized = errorUnauthorized;
const errorForbidden = (publicMessage) => new ServiceException(publicMessage, `[FORBIDDEN] : ${publicMessage}`, 403, interface_1.LogLevel.INFO);
exports.errorForbidden = errorForbidden;
const securityException = (publicMessage) => new ServiceException(publicMessage, `[SECURITY] : ${publicMessage}`, 500, interface_1.LogLevel.WARNING);
exports.securityException = securityException;
const errorLocked = (message) => new ServiceException('resource is locked', `[LOCKED] : ${message}`, 423, interface_1.LogLevel.WARNING);
exports.errorLocked = errorLocked;
