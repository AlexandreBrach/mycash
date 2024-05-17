import { FC, ReactNode, createContext, useEffect, useReducer } from 'react';
import { Echeance, Encours, MonthData, PrevisionRules } from '../interfaces/extraits';
import factory from '../services/Factory';
import { Tree, treeDerive, treeMap } from '../exportable/Hierarchie/Tree';
import { camaieuDerivative } from '../helpers/categories';

interface AppState {
  availableMonths: MonthData[];
  availableCategories: Array<Tree<{ name: string }>>;
  categoryColors: Array<Tree<{ color: string }>>;
  previsionsRules: PrevisionRules[];
  encours: Encours[];
  monthlyPrevisions: Echeance[];
}

const unassignedCategory = { id: '0', children: [], data: { name: 'Non Assigné' } };
const unassignedColor = { id: '0', children: [], data: { color: '#AAAAAA' } };

const initialState: AppState = {
  availableMonths: [],
  availableCategories: [unassignedCategory],
  categoryColors: [],
  previsionsRules: [],
  encours: [],
  monthlyPrevisions: [],
};

// pas d'intérêt fonctionnel, c'est là uniquement pour l'export
// les valeurs sont ovveridées plus bas
export const AppContext = createContext<{ state: AppState; dispatch: (value: { type: string; data: any }) => void }>({
  state: initialState,
  dispatch: (value: { type: string; data: any }) => {},
});

interface Props {
  children?: ReactNode;
}

const AppContextProvider: FC<Props> = ({ children }) => {
  const monthService = factory.getMonthService();
  const categoryService = factory.getCategoryService();
  const previsionService = factory.getPrevisionsService();
  const encoursService = factory.getEncoursService();

  const reducer = (state: AppState, action: { type: string; data: any }): AppState => {
    switch (action.type) {
      case 'setAll':
        return {
          ...state,
          ...action.data,
        };
      case 'setAvailableMonth':
        return { ...state, availableMonths: action.data.availableMonths };
      case 'setAvailableCategories':
        return { ...state, availableCategories: [unassignedCategory, ...action.data.availableCategories] };
      case 'setCategoriesFromBackend':
        const availableCategories = treeMap<{ name: string; color: string }, { name: string }>(action.data, (c) => ({
          name: c.name,
        }));
        const categoryColors = treeMap<{ name: string; color: string }, { color: string }>(action.data, (c) => ({
          color: c.color,
        })).map((c) => treeDerive(c, camaieuDerivative));
        return {
          ...state,
          availableCategories: [unassignedCategory, ...availableCategories],
          categoryColors: [unassignedColor, ...categoryColors],
        };
      case 'setPrevisionsRules':
        return {
          ...state,
          previsionsRules: action.data.previsionsRules,
        };
      case 'setEncours':
        return {
          ...state,
          encours: action.data.encours,
        };
      default:
        throw Error(`action ${action.type} is not managed`);
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const store = {
    state,
    dispatch,
  };

  useEffect(() => {
    const run = async () => {
      const availableMonths = await monthService.getAvailables();
      const raw = await categoryService.getTree();
      dispatch({ type: 'setCategoriesFromBackend', data: raw });
      const previsionsRules = await previsionService.getRules();
      const encours = await encoursService.getAll();
      const previsions = await previsionService.getAllPrevisions();
      dispatch({
        type: 'setAll',
        data: {
          availableMonths,
          previsionsRules,
          encours,
          monthlyPrevisions: previsions,
        },
      });
    };
    void run();
  }, [monthService, categoryService, previsionService, encoursService]);

  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
