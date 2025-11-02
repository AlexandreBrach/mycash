import { getConsoleLoggerService } from './Logger/ConsoleLoggerService';
import ApplicationStateService, { ApplicationStateServiceInterface } from './ApplicationState/ApplicationStateService';
import { LoggerServiceInterface } from './Logger/interface';
import { config } from '../config';
import { EmailService, EmailServiceInterface } from './Email/EmailService';

export interface FactoryInterface {
  getApplicationStateService: () => ApplicationStateServiceInterface;
  getLoggerService: () => LoggerServiceInterface;
  getEmailService: () => EmailServiceInterface; // Placeholder for future email service
}

const Factory = (): FactoryInterface => {
  const logger = getConsoleLoggerService(config.LOG_LEVEL);
  const applicationStateService = ApplicationStateService();
  const emailService = EmailService();

  return {
    getApplicationStateService: () => applicationStateService,
    getLoggerService: (): LoggerServiceInterface => {
      return logger;
    },
    getEmailService: () => emailService,
  };
};

export default Factory();
