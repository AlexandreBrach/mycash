"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("../core/exceptions");
const jsonBodyErrorHandlerMiddleware = (error, req, res, next) => {
    if (error.status === 400 && error instanceof SyntaxError && 'body' in error) {
        next({ message: 'Bad query', exception: (0, exceptions_1.errorInvalidParameters)('Malformed body') });
    }
    else {
        next(error);
    }
};
exports.default = jsonBodyErrorHandlerMiddleware;
