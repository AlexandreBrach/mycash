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
  getEcheancesInInterval: (startMonth: Date, month: number) => Promise<Echeance[]>;
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
      })),
    };
  };

  const deleteEcheancier = async (collection: string): Promise<void> => {
    await backend.get(`/previsions/echeancier/${collection}/delete`);
  };

  return {
    getRules: async (): Promise<PrevisionRules[]> => {
      const response = (await backend.get<{ response: any[] }>('/previsions/rules')).response;
      // convert Json-stringyfied float values
      return response.map((response) => ({
        ...response,
        amount: parseFloat(response.amount as string),
        start: new Date(response.start),
        end: response.end === null ? undefined : new Date(response.end),
      }));
    },
    setRule: async (rule: PrevisionRules): Promise<void> => {
      const e: Record<string, string> = {
        start: backend.toBackendDateFormat(rule.start),
      };
      if (rule.end) {
        e.end = backend.toBackendDateFormat(rule.end);
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
      const result = await backend.get<{ result: { id: string; category: string }[] }>(`/previsions/echeanciers`);
      return result.result;
    },
    getEcheancesInInterval: async (start: Date, month: number): Promise<Echeance[]> => {
      const end = new Date(start.getFullYear(), start.getMonth() + month);
      const data = await backend.get<{ result: BackendEcheance[] }>(
        `/previsions/echeances/${start.getFullYear()}-${start.getMonth() + 1}/${end.getFullYear()}-${
          end.getMonth() + 1
        }`,
      );
      return data.result.map((e) => ({ ...e, amount: parseFloat(e.amount) }));
    },
    getAllPrevisions: async (): Promise<Echeance[]> => {
      const raw = await backend.get<{ result: BackendEcheance[] }>('/previsions/list');
      return raw.result.map((e) => ({ ...e, amount: parseFloat(e.amount) }));
    },
  };
};

export default PrevisionsService;
