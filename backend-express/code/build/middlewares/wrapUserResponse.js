"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getWrapUserResponseMiddleware = () => {
    return (req, res) => {
        res.send(res.locals.response);
    };
};
exports.default = getWrapUserResponseMiddleware;
