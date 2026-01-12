import ApplicationStateServiceStub from './Miscellanious/ApplicationStateServiceStub';
import { FactoryInterface } from './Factory';
import { LoggerServiceInterface } from './Logger/interface';
import { getConsoleLoggerService } from './Logger/ConsoleLoggerService';
import { ApplicationConfig } from '../config';

export const FactoryStub = (): Partial<FactoryInterface> => {
  const logger = getConsoleLoggerService(ApplicationConfig.LOG_LEVEL);
  const applicationStateService = ApplicationStateServiceStub();
  return {
    getApplicationStateService: () => applicationStateService,
    getLoggerService: (): LoggerServiceInterface => {
      return logger;
    },
  };
};
