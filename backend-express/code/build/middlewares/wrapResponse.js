"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getWrapResponseMiddleware = () => {
    return (req, res) => {
        res.send(res.locals.response);
    };
};
exports.default = getWrapResponseMiddleware;
