"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const getInputVerboseMiddleware = (logger, verbose) => {
    return (req, res, next) => {
        if (verbose) {
            logger.debug(() => req.method + ' ' + req.path);
            logger.debug(() => util_1.default.inspect(req.body, { showHidden: false, depth: null, colors: true }));
        }
        next();
    };
};
exports.default = getInputVerboseMiddleware;
