import { getConsoleLoggerService } from './Logger/ConsoleLoggerService';
import ApplicationStateService, { ApplicationStateServiceInterface } from './Miscellanious/ApplicationStateService';
import { LoggerServiceInterface } from './Logger/interface';
import { PrevisionsService, PrevisionsServiceInterface } from './PrevisionsService/PrevisionsService';
import { ApplicationConfig } from '../config';
import { DebugService, DebugServiceInterface } from './Miscellanious/InputVerboseService';
import { RulesRepository } from '../infra/typeorm/rules/RuleRepository';
import { CategoryService, CategoryServiceInterface } from './CategoryService/CategoryService';
import { CategoryRepository } from '../infra/typeorm/category/CategoryRepository';
import { ExtraitService, ExtraitServiceInterface } from './ExtraitService/ExtraitService';
import { ExtraitRepository } from '../infra/typeorm/extrait/ExtraitRepository';
import { EncoursService, EncoursServiceInterface } from './EncoursService/EncoursService';
import { EncoursRepository } from '../infra/typeorm/encours/EncoursRepository';
import { RulesService, RulesServiceInterface } from './RulesService/RulesService';
import { SyntheseService, SyntheseServiceInterface } from './SyntheseService/SyntheseService';
import { SyntheseRepository } from '../infra/typeorm/synthese/SyntheseRepository';
import { EcheanceRepository } from '../infra/typeorm/echeance/EcheanceRepository';
import { AppDataSource } from '../infra/typeorm/ormconfig';
import { CategoryOrm } from '../infra/typeorm/category/category';

export interface FactoryInterface {
  getApplicationStateService: () => ApplicationStateServiceInterface;
  getLoggerService: () => LoggerServiceInterface;
  getPrevisionsService: () => PrevisionsServiceInterface;
  getDebugService: () => DebugServiceInterface;
  getCategoryService: () => CategoryServiceInterface;
  getExtraitService: () => ExtraitServiceInterface;
  getEncoursService: () => EncoursServiceInterface;
  getRulesService: () => RulesServiceInterface;
  getSyntheseService: () => SyntheseServiceInterface;
}

export const Factory = (): FactoryInterface => {
  const config = ApplicationConfig;
  const logger = getConsoleLoggerService(config.LOG_LEVEL);
  const debugService = DebugService(config.DEBUG_HTTP, logger);
  const echeanceRepository = EcheanceRepository();
  const applicationStateService = ApplicationStateService();
  const ruleRepository = RulesRepository();
  const encoursRepository = EncoursRepository();
  const rulesService = RulesService(ruleRepository);

  const categoryRepository = CategoryRepository();
  const categoryService = CategoryService(categoryRepository);
  const extraitService = ExtraitService(ExtraitRepository());
  const encoursService = EncoursService(encoursRepository);

  const syntheseService = SyntheseService(SyntheseRepository());
  const previsionsService = PrevisionsService(echeanceRepository, rulesService);
  return {
    getApplicationStateService: () => applicationStateService,
    getLoggerService: (): LoggerServiceInterface => {
      return logger;
    },
    getPrevisionsService: () => previsionsService,
    getDebugService: () => debugService,
    getCategoryService: () => categoryService,
    getExtraitService: () => extraitService,
    getEncoursService: () => encoursService,
    getRulesService: () => rulesService,
    getSyntheseService: () => syntheseService,
  };
};
