"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandlerMiddleware_1 = __importDefault(require("./errorHandlerMiddleware"));
const inputVerboseMiddleware_1 = __importDefault(require("./inputVerboseMiddleware"));
const unmanagedExceptionMiddleware_1 = __importDefault(require("./unmanagedExceptionMiddleware"));
const wrapUserResponse_1 = __importDefault(require("./wrapUserResponse"));
const wrapResponse_1 = __importDefault(require("./wrapResponse"));
const config_1 = require("../config");
const MiddlewareFactory = (factory) => {
    const logger = factory.getLoggerService();
    return {
        errorHandlerMiddleWare: (0, errorHandlerMiddleware_1.default)(logger),
        unmanagedExceptionMiddleWare: (0, unmanagedExceptionMiddleware_1.default)(logger),
        inputVerboseMiddleware: (0, inputVerboseMiddleware_1.default)(logger, config_1.config.DEBUG_HTTP),
        wrapUserResponseMiddleware: (0, wrapUserResponse_1.default)(),
        wrapResponseMiddleware: (0, wrapResponse_1.default)(),
    };
};
exports.default = MiddlewareFactory;
