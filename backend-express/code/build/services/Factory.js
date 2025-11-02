"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConsoleLoggerService_1 = require("./Logger/ConsoleLoggerService");
const ApplicationStateService_1 = __importDefault(require("./ApplicationState/ApplicationStateService"));
const config_1 = require("../config");
const EmailService_1 = require("./Email/EmailService");
const Factory = () => {
    const logger = (0, ConsoleLoggerService_1.getConsoleLoggerService)(config_1.config.LOG_LEVEL);
    const applicationStateService = (0, ApplicationStateService_1.default)();
    const emailService = (0, EmailService_1.EmailService)();
    return {
        getApplicationStateService: () => applicationStateService,
        getLoggerService: () => {
            return logger;
        },
        getEmailService: () => emailService,
    };
};
exports.default = Factory();
