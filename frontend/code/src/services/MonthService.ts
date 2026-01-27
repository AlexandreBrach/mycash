import { Month } from '../exportable/Interval/Month';
import { FormatServiceInterface } from './FormatService';
import { BackendFacadeInterface } from './backendFacade';

export interface MonthServiceInterface {
  getAvailables: () => Promise<Month[]>;
}

const MonthService = function (
  backend: BackendFacadeInterface,
  formatService: FormatServiceInterface,
): MonthServiceInterface {
  const getAvailableMonth = async (): Promise<Month[]> => {
    const result = await backend.get<string[]>('/get-months');
    return result.map((s) => new Month(new Date(Date.UTC(parseInt(s.split('-')[0]), parseInt(s.split('-')[1]) - 1))));
  };

  /**
   * Return all existing month in data
   *
   *
   */
  const getAvailables = async (): Promise<Month[]> => {
    const data = await getAvailableMonth();
    return data;
  };

  return {
    getAvailables,
  };
};

export default MonthService;
