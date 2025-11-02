"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getUnmanagedExceptionMiddleWare = (logger) => {
    return (exception, req, res, next) => {
        logger.error(`[UNMANAGED ERROR THROWN] at ${JSON.stringify(req.originalUrl)}`);
        logger.error(exception);
        res.status(500).send('{"message":"Unexpected error occurs"}');
    };
};
exports.default = getUnmanagedExceptionMiddleWare;
