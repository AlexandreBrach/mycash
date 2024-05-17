import { config } from '../config';
import BackendStateService, { BackendStateServiceInterface } from './BackendStateService';
import CategorieService, { CategorieServiceInterface } from './CategoriesService';
import EncoursService, { EncoursServiceInterface } from './EncoursService';
import ExtraitsService, { ExtraitsServiceInterface } from './ExtraitsService';
import FormatService, { FormatServiceInterface } from './FormatService';
import MonthService, { MonthServiceInterface } from './MonthService';
import PrevisionsService, { PrevisionsServiceInterface } from './PrevisionsService';
import BackendFacadeFactory from './backendFacade';
import { KeycloakService } from './keycloak/KeycloakService';

export interface FactoryInterface {
  getCategoryService: () => CategorieServiceInterface;
  getExtraitsService: () => ExtraitsServiceInterface;
  getFormatService: () => FormatServiceInterface;
  getMonthService: () => MonthServiceInterface;
  getPrevisionsService: () => PrevisionsServiceInterface;
  getBackendStateService: () => BackendStateServiceInterface;
  getEncoursService: () => EncoursServiceInterface;
}

const Factory = (): FactoryInterface => {
  const keycloakService = KeycloakService();
  const backendFacadeFactory = BackendFacadeFactory(config.api.baseUrl as string, keycloakService);
  const backendFacade = backendFacadeFactory.get();
  const formatService = FormatService();

  const extraitService = ExtraitsService(backendFacade);
  const categoryService = CategorieService(backendFacade);
  const monthService = MonthService(backendFacade, formatService);
  const previsionService = PrevisionsService(backendFacade);
  const backendStateService = BackendStateService(backendFacade);
  const encoursService = EncoursService(backendFacade);

  return {
    getExtraitsService: (): ExtraitsServiceInterface => extraitService,
    getCategoryService: (): CategorieServiceInterface => categoryService,
    getFormatService: (): FormatServiceInterface => formatService,
    getMonthService: (): MonthServiceInterface => monthService,
    getPrevisionsService: (): PrevisionsServiceInterface => previsionService,
    getBackendStateService: (): BackendStateServiceInterface => backendStateService,
    getEncoursService: (): EncoursServiceInterface => encoursService,
  };
};

const factory = Factory();

export default factory;
