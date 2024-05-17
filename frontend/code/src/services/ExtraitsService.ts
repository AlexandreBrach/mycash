import { Criteria, ExtraitLine, TSynthese } from "../interfaces/extraits";
import { BackendFacadeInterface } from "./backendFacade";

export interface ExtraitsServiceInterface {
  getExtraits: () => {};
  filterExtraits: (criteria: Criteria) => Promise<ExtraitLine[]>;
  updateRefDate: (ids: string[], date: string) => Promise<void>;
  retrieveSynthese: () => Promise<TSynthese>;
  uploadExtraits: (selectedFile: File) => Promise<void>;
  updateNote: (id: string, note: string) => Promise<void>;
}

const ExtraitsService = (backend: BackendFacadeInterface): // backend: BackendHandlerInterface
  ExtraitsServiceInterface => {
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
      line.date_operation = new Date(line.date_operation);
      if (null !== line.categorie_month) {
        line.categorie_month = new Date(line.categorie_month);
      }
      result.push(line);
    }
    return result;
  };

  /**
   * get extraits
   *
   */
  const getExtraits = async (): Promise<Record<number, ExtraitLine>> => {
    const rawLines = await backend.post<any[]>("/get-extraits", {});
    return assembleExtrait(rawLines);
  };

  /**
   * filter extraits
   *
   */
  const filterExtraits = async (criteria: Criteria): Promise<ExtraitLine[]> => {
    // at start, context may be unready : avoid useless request
    if (criteria.month === "") {
      return [];
    }
    const backendCriteria: Record<string, any> = { ...criteria };
    if (criteria.categoryId !== undefined) {
      backendCriteria.category_id = criteria.categoryId;
    }
    const response = await backend.post<any[]>("/filter-extraits", backendCriteria);
    return assembleExtrait(response);
  };

  /**
   * update refdate
   *
   */
  const updateRefDate = async (ids: string[], date: string): Promise<void> => {
    await backend.post<any[]>("/set-date-reference", { ids, date });
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
      Object.keys(data[monthName]).forEach((categoryId) => {
        if (categoryId === 'null') {
          response[monthName]["0"] = parseFloat(data[monthName][categoryId] as string);
        } else {
          response[monthName][categoryId] = parseFloat(data[monthName][categoryId] as string);
        }
      });
    });

    return response;
  }

  const uploadExtraits = async (selectedFile: File): Promise<void> => {
    const formData = new FormData();

    formData.append(
      "fileUpload",
      selectedFile!,
      selectedFile!.name
    );

    await backend.upload<void>("/upload-extraits", formData);
  }

  const updateNote = async (id: string, note: string) => {
    await backend.post<void>(`/add-note/${id}`, { note });
  }


  return { getExtraits, filterExtraits, updateRefDate, retrieveSynthese, uploadExtraits, updateNote };
};

export default ExtraitsService;
