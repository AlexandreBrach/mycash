"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = require("../services/Logger/interface");
const exceptions_1 = require("../core/exceptions");
function isExceptionInfo(data) {
    return typeof data === 'object' && 'message' in data && 'exception' in data;
}
const getErrorHandlerMiddleWare = (logger) => (err, req, res, next) => {
    if (err instanceof exceptions_1.ServiceException) {
        let publicMessage = err.publicMessage ? err.publicMessage : 'Unexpected error occurs';
        const httpStatus = err.httpStatus ? err.httpStatus : 500;
        const level = err.logLevel ? err.logLevel : interface_1.LogLevel.ERROR;
        const logMessage = err.logMessage;
        logger.log(logMessage, level);
        res.status(httpStatus).send(`{"message":"${publicMessage}"}`);
        return;
    }
    if (isExceptionInfo(err)) {
        const exception = err.exception;
        if (exception instanceof exceptions_1.ServiceException) {
            let publicMessage = exception.publicMessage ? exception.publicMessage : 'Unexpected error occurs';
            const httpStatus = exception.httpStatus ? exception.httpStatus : 500;
            const level = exception.logLevel ? exception.logLevel : interface_1.LogLevel.ERROR;
            const logMessage = exception.logMessage;
            logger.log(logMessage, level);
            if (err.message) {
                publicMessage = `${err.message} : ${publicMessage}`;
            }
            res.status(httpStatus).send(`{"message":"${publicMessage}"}`);
        }
        else {
            logger.error(`"${err.message}" : ExceptionInfo with a non-business exception.`);
            next(err.exception);
        }
    }
    else {
        next(err);
    }
};
exports.default = getErrorHandlerMiddleWare;
