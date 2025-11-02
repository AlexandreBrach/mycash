import { FactoryInterface } from '../services/Factory';
import getRouterState from './state';

const RouterFactory = (factory: FactoryInterface) => {
  return {
    state: getRouterState(factory.getApplicationStateService()),
  };
};

export default RouterFactory;
