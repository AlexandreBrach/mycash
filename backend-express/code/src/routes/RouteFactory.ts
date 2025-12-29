import { getRouterPrevisions } from './getRouterPrevisions';
import getRouterState from './state';
import { getRouterCategories } from './getRouterCategories';
import { getRouterGetMonths } from './getMonths';
import { getRouterEncours } from './getRouterEncours';
import { getRouterExtraits } from './getRouterExtraits';

const RouterFactory = () => {
  return {
    state: getRouterState(),
    previsions: getRouterPrevisions(),
    categories: getRouterCategories(),
    getMonths: getRouterGetMonths(),
    encours: getRouterEncours(),
    extraits: getRouterExtraits(),
  };
};

export default RouterFactory;
