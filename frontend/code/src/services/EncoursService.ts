import { BackendEncours, Encours } from '../interfaces/extraits';
import { BackendFacadeInterface } from './backendFacade';

export interface EncoursServiceInterface {
  getAll: () => Promise<Encours[]>;
}

const EncoursService = (backend: BackendFacadeInterface): EncoursServiceInterface => {
  return {
    getAll: async (): Promise<Encours[]> => {
      const raw = (await backend.get<{ result: BackendEncours[] }>('/encours')).result;
      return raw.map((r) => ({ ...r, date: new Date(r.date), amount: parseFloat(r.amount) }));
    },
  };
};

export default EncoursService;
