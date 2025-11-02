import ApplicationStateServiceStub from './ApplicationState/ApplicationStateServiceStub';
import { FactoryInterface } from './Factory';
import { LoggerServiceInterface } from './Logger/interface';
import { getConsoleLoggerService } from './Logger/ConsoleLoggerService';
import { config } from '../config';
import { EmailServiceStub } from './Email/EmailServiceStub';

export const FactoryStub = (): FactoryInterface => {
  const logger = getConsoleLoggerService(config.LOG_LEVEL);
  const applicationStateService = ApplicationStateServiceStub();
  const emailService = EmailServiceStub();
  return {
    getApplicationStateService: () => applicationStateService,
    getLoggerService: (): LoggerServiceInterface => {
      return logger;
    },
    getEmailService: () => emailService,
  };
};
