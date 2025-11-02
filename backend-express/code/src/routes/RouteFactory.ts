import { getRouterPrevisions } from './getRouterPrevisions';
import getRouterState from './state';

const RouterFactory = () => {
  return {
    state: getRouterState(),
    previsions: getRouterPrevisions(),
  };
};

export default RouterFactory;
