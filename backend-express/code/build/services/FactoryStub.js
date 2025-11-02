"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactoryStub = void 0;
const ApplicationStateServiceStub_1 = __importDefault(require("./ApplicationState/ApplicationStateServiceStub"));
const ConsoleLoggerService_1 = require("./Logger/ConsoleLoggerService");
const config_1 = require("../config");
const EmailServiceStub_1 = require("./Email/EmailServiceStub");
const FactoryStub = () => {
    const logger = (0, ConsoleLoggerService_1.getConsoleLoggerService)(config_1.config.LOG_LEVEL);
    const applicationStateService = (0, ApplicationStateServiceStub_1.default)();
    const emailService = (0, EmailServiceStub_1.EmailServiceStub)();
    return {
        getApplicationStateService: () => applicationStateService,
        getLoggerService: () => {
            return logger;
        },
        getEmailService: () => emailService,
    };
};
exports.FactoryStub = FactoryStub;
