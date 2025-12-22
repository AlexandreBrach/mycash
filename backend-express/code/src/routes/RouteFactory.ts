import { getRouterPrevisions } from './getRouterPrevisions';
import getRouterState from './state';
import { getRouterCategories } from './getRouterCategories';

const RouterFactory = () => {
  return {
    state: getRouterState(),
    previsions: getRouterPrevisions(),
    categories: getRouterCategories(),
  };
};

export default RouterFactory;
