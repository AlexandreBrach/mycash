"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const backendCheck = (req, res) => res
    .status(200)
    .send(`Server is alive and healthy. Application version : ${process.env.APPLICATION_VERSION}.`);
exports.default = backendCheck;
