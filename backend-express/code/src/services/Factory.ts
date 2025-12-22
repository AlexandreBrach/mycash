import { getConsoleLoggerService } from './Logger/ConsoleLoggerService';
import ApplicationStateService, { ApplicationStateServiceInterface } from './Miscellanious/ApplicationStateService';
import { LoggerServiceInterface } from './Logger/interface';
import { PrevisionsService, PrevisionsServiceInterface } from './PrevisionsService/PrevisionsService';
import { ApplicationConfig } from '../config';
import { DebugService, DebugServiceInterface } from './Miscellanious/InputVerboseService';
import { GenericRepository } from '../infra/typeorm/GenericRepository';
import { RulesOrmRepository } from '../infra/typeorm/rules/RuleRepository';
import { Rules } from '../infra/typeorm/rules/rules';
import { CategoryService, CategoryServiceInterface } from './CategoryService/CategoryService';
import { CategoryRepository } from '../infra/typeorm/category/CategoryRepository';
import { ExtraitService, ExtraitServiceInterface } from './ExtraitService/ExtraitService';
import { ExtraitRepository } from '../infra/typeorm/extrait/ExtraitRepository';

export interface FactoryInterface {
  getApplicationStateService: () => ApplicationStateServiceInterface;
  getLoggerService: () => LoggerServiceInterface;
  getPrevisionsService: () => PrevisionsServiceInterface; // Placeholder for future email service
  getDebugService: () => DebugServiceInterface;
  getCategoryService: () => CategoryServiceInterface;
  getExtraitService: () => ExtraitServiceInterface;
}

export const Factory = (): FactoryInterface => {
  const config = ApplicationConfig;
  const logger = getConsoleLoggerService(config.LOG_LEVEL);
  const debugService = DebugService(config.DEBUG_HTTP, logger);
  const applicationStateService = ApplicationStateService();
  const previsionsService = PrevisionsService(GenericRepository<Rules>(RulesOrmRepository));
  const categoryService = CategoryService(CategoryRepository());
  const extraitService = ExtraitService(ExtraitRepository());

  return {
    getApplicationStateService: () => applicationStateService,
    getLoggerService: (): LoggerServiceInterface => {
      return logger;
    },
    getPrevisionsService: () => previsionsService,
    getDebugService: () => debugService,
    getCategoryService: () => categoryService,
    getExtraitService: () => extraitService,
  };
};
