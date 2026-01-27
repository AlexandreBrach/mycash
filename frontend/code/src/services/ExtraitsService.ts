import { Month } from '../exportable/Interval/Month';
import { Criteria, ExtraitLine, TSynthese } from '../interfaces/extraits';
import { BackendFacadeInterface } from './backendFacade';

export interface ExtraitsServiceInterface {
  filterExtraits: (criteria: Criteria) => Promise<ExtraitLine[]>;
  updateRefDate: (ids: string[], date: string) => Promise<void>;
  retrieveSynthese: () => Promise<TSynthese>;
  uploadExtraits: (selectedFile: File) => Promise<void>;
  updateNote: (id: string, note: string) => Promise<void>;
}

const ExtraitsService = (backend: BackendFacadeInterface): ExtraitsServiceInterface => {
  /**
   *
   * When retrieving extraits, the backend response is altered according to the folowing :
   *
   * the response will be an object with keys equal to the id value
   */
  const assembleExtrait = (data: any[]): ExtraitLine[] => {
    var result = [] as ExtraitLine[];
    for (var line of data) {
      line.montant = parseFloat(line.montant);
      line.date = new Date(line.date);
      if (null !== line.categorie_month) {
        line.categorie_month = new Date(line.categorie_month);
      }
      result.push(line);
    }
    return result;
  };

  /**
   * filter extraits
   *
   */
  const filterExtraits = async (criteria: Criteria): Promise<ExtraitLine[]> => {
    // at start, context may be unready : avoid useless request
    if (criteria.month === undefined) {
      return [];
    }
    const backendCriteria: Record<string, any> = { ...criteria };
    if (criteria.categoryId !== undefined) {
      backendCriteria.category_id = criteria.categoryId;
    }
    const query: string[] = [];
    if (criteria.month) {
      query.push(`month=${criteria.month}`);
    }
    if (criteria.categoryId) {
      query.push(`categoryId=${criteria.categoryId}`);
    }
    const response = await backend.get<any[]>(`/extraits/filter?${query.join('&')}`);
    return assembleExtrait(response);
  };

  /**
   * update refdate
   *
   */
  const updateRefDate = async (ids: string[], date: string): Promise<void> => {
    await backend.post<any[]>('/set-date-reference', { ids, date });
  };

  /**
   * Retrieve and assemble synthese
   *
   * @returns
   */
  const retrieveSynthese = async (): Promise<TSynthese> => {
    const data = await backend.get<Record<string, Record<string, string | number>>>('/synthese-category');

    const response: TSynthese = {};
    Object.keys(data).forEach((monthName: string) => {
      response[monthName] = {};
      Object.keys(data[monthName]).forEach((categoryId: string) => {
        if (categoryId === 'null') {
          response[monthName]['0'] = data[monthName][categoryId] as number;
        } else {
          response[monthName][categoryId] = data[monthName][categoryId] as number;
        }
      });
    });

    return response;
  };

  const uploadExtraits = async (selectedFile: File): Promise<void> => {
    const formData = new FormData();

    formData.append('fileUpload', selectedFile!, selectedFile!.name);

    await backend.upload<void>('/upload-extraits', formData);
  };

  const updateNote = async (id: string, note: string) => {
    await backend.post<void>(`/add-note/${id}`, { note });
  };

  return { filterExtraits, updateRefDate, retrieveSynthese, uploadExtraits, updateNote };
};

export default ExtraitsService;
