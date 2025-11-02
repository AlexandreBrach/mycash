"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApplicationStateService = () => {
    const setState = () => {
        const p = Promise.resolve({ ready: true });
        return p;
    };
    const getState = async () => {
        const p = Promise.resolve({ ready: true });
        return p;
    };
    return {
        get: getState,
        set: setState,
    };
};
exports.default = ApplicationStateService;
