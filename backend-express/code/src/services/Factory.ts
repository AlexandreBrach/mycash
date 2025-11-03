import { getConsoleLoggerService } from './Logger/ConsoleLoggerService';
import ApplicationStateService, { ApplicationStateServiceInterface } from './Miscellanious/ApplicationStateService';
import { LoggerServiceInterface } from './Logger/interface';
import { PrevisionsService, PrevisionsServiceInterface } from './PrevisionsService/PrevisionsService';
import { ApplicationConfig } from '../config';
import { DebugService, DebugServiceInterface } from './Miscellanious/InputVerboseService';
import { GenericRepository } from '../infra/typeorm/GenericRepository';
import { RulesRepository } from '../infra/typeorm/rules/RuleRepository';
import { Rules } from '../infra/typeorm/rules/rules';

export interface FactoryInterface {
  getApplicationStateService: () => ApplicationStateServiceInterface;
  getLoggerService: () => LoggerServiceInterface;
  getPrevisionsService: () => PrevisionsServiceInterface; // Placeholder for future email service
  getDebugService: () => DebugServiceInterface;
}

export const Factory = (): FactoryInterface => {
  const config = ApplicationConfig;
  const logger = getConsoleLoggerService(config.LOG_LEVEL);
  const debugService = DebugService(config.DEBUG_HTTP, logger);
  const applicationStateService = ApplicationStateService();
  const previsionsService = PrevisionsService(GenericRepository<Rules>(RulesRepository));

  return {
    getApplicationStateService: () => applicationStateService,
    getLoggerService: (): LoggerServiceInterface => {
      return logger;
    },
    getPrevisionsService: () => previsionsService,
    getDebugService: () => debugService,
  };
};
