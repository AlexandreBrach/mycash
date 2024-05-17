import { MonthData } from '../interfaces/extraits';
import { FormatServiceInterface } from './FormatService';
import { BackendFacadeInterface } from './backendFacade';

export interface MonthServiceInterface {
  getAvailables: () => Promise<MonthData[]>;
  getMonthAfter: (month: string) => string;
}

const MonthService = function (
  backend: BackendFacadeInterface,
  formatService: FormatServiceInterface,
): MonthServiceInterface {
  /**
   * Renvoie la chaine représentant le mois suivant le mois passé
   * en paramètre (chaine "YYYY-mm")
   */
  const getMonthAfter = (month: string): string => {
    let arrayMonth = month.split('-');
    let y = parseInt(arrayMonth[0]);
    let m = parseInt(arrayMonth[1]);

    if (12 === m) {
      m = 1;
      y += 1;
    } else {
      m += 1;
    }
    return y + '-' + m;
  };

  const getAvailableMonth = async (): Promise<string[]> => {
    const result = await backend.get<string[]>('/get-months');
    return result;
  };

  /**
   * Return all existing month in data
   *
   *
   */
  const getAvailables = async (): Promise<MonthData[]> => {
    const data = await getAvailableMonth();
    let later = getMonthAfter(data[0]);
    data.unshift(later);
    const availableMonth: MonthData[] = [];
    data.forEach((value: string) => {
      const date = Date.parse(`${value}-01`);
      availableMonth.push({
        value,
        label: formatService.renderMonthFromSimplified(value),
        timestamp: date,
      });
    });
    return availableMonth.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  };

  return {
    getAvailables,
    getMonthAfter,
  };
};

export default MonthService;
