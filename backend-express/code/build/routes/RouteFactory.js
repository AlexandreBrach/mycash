"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = __importDefault(require("./state"));
const RouterFactory = (factory) => {
    return {
        state: (0, state_1.default)(factory.getApplicationStateService()),
    };
};
exports.default = RouterFactory;
