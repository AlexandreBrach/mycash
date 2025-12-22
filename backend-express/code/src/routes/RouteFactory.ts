import { getRouterPrevisions } from './getRouterPrevisions';
import getRouterState from './state';
import { getRouterCategories } from './getRouterCategories';
import { getRouterGetMonths } from './getMonths';

const RouterFactory = () => {
  return {
    state: getRouterState(),
    previsions: getRouterPrevisions(),
    categories: getRouterCategories(),
    getMonths: getRouterGetMonths(),
  };
};

export default RouterFactory;
