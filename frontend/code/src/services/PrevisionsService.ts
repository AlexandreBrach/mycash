import { Month } from '../exportable/Interval/Month';
import { BackendEcheance, Echeance, Echeancier, PrevisionRules } from '../interfaces/extraits';
import { BackendFacadeInterface } from './backendFacade';

export interface PrevisionsServiceInterface {
  getRules: () => Promise<PrevisionRules[]>;
  setRule: (rule: PrevisionRules) => Promise<void>;
  deleteRule: (id: number) => Promise<void>;
  getEcheancier: (collection: string) => Promise<Echeancier>;
  deleteEcheancier: (collection: string) => Promise<void>;
  setEcheancier: (echeancierId: string | undefined, echeancier: Echeance[]) => Promise<void>;
  getEcheanciers: () => Promise<{ id: string; category: string }[]>;
  getEcheancesInInterval: (startMonth: Month, month: number) => Promise<Echeance[]>;
  getAllPrevisions: () => Promise<Echeance[]>;
}

const PrevisionsService = (backend: BackendFacadeInterface): PrevisionsServiceInterface => {
  const getEcheancier = async (collection: string): Promise<Echeancier> => {
    const data = await backend.get<{
      result: Echeancier<BackendEcheance>;
    }>(`/previsions/echeancier/${collection}`);
    const result = data.result;
    return {
      ...result,
      echeancier: result.echeancier.map((e) => ({
        ...e,
        amount: parseFloat(e.amount),
        date: Month.fromString(e.date),
      })),
    };
  };

  const deleteEcheancier = async (collection: string): Promise<void> => {
    await backend.get(`/previsions/echeancier/${collection}/delete`);
  };

  return {
    getRules: async (): Promise<PrevisionRules[]> => {
      const response = await backend.get<any[]>('/previsions/rules');

      return response.map((response) => ({
        ...response,
        amount: parseFloat(response.amount as string),
        start: new Month(new Date(response.start)),
        end: response.end === null ? undefined : new Month(new Date(response.end)),
      }));
    },
    setRule: async (rule: PrevisionRules): Promise<void> => {
      const e: Record<string, string> = {
        start: backend.toBackendDateFormat(rule.start.getDate()),
      };
      if (rule.end) {
        e.end = backend.toBackendDateFormat(rule.end.getDate());
      }
      return await backend.post<void>('/previsions/rule', { rule: { ...rule, ...e } });
    },
    deleteRule: async (id: number): Promise<void> => {
      return await backend.post<void>(`/previsions/rule/${id}/delete`, {});
    },
    setEcheancier: async (echeancierId: string | undefined, echeancier: Echeance[]): Promise<void> => {
      if (echeancierId === undefined) {
        return await backend.post<void>(`/previsions/echeancier`, {
          echeancier,
        });
      } else {
        return await backend.post<void>(`/previsions/echeancier/${echeancierId}`, {
          echeancier,
        });
      }
    },
    deleteEcheancier,
    getEcheancier,
    getEcheanciers: async (): Promise<{ id: string; category: string }[]> => {
      const result = await backend.get<{ id: string; category: string }[]>(`/previsions/echeanciers`);
      return result;
    },
    getEcheancesInInterval: async (start: Month, months: number): Promise<Echeance[]> => {
      const end = start.nextMonth(months);
      const data = await backend.get<BackendEcheance[]>(`/previsions/echeances/${start.toString()}/${end.toString()}`);
      return data.map((e) => ({ ...e, amount: parseFloat(e.amount), date: Month.fromString(e.date) }));
    },
    getAllPrevisions: async (): Promise<Echeance[]> => {
      const raw = await backend.get<BackendEcheance[]>('/previsions');
      return raw.map((e) => ({ ...e, amount: parseFloat(e.amount), date: Month.fromString(e.date) }));
    },
  };
};

export default PrevisionsService;
