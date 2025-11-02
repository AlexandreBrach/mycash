"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const logLevelFromString = (level) => {
    const index = ['ERROR', 'WARNING', 'NOTICE', 'INFO', 'DEBUG'].indexOf(level);
    return (index === -1 ? 3 : index);
};
const env = (varName, defaultValue = '') => {
    const envVar = process.env[varName];
    return envVar !== '' ? envVar : defaultValue;
};
exports.config = {
    LOG_LEVEL: logLevelFromString(env('LOG_LEVEL', 'INFO')),
    DEBUG_HTTP: env('DEBUG_HTTP', '0') === '1',
    APP_PORT: 8080,
    DATA_DIR: '/data',
    API_URL: env('API_URL', 'http://localhost:8989'),
};
exports.default = exports.config;
