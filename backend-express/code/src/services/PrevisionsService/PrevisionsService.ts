import { Interval } from '../../exportable/Interval/Interval';
import { Month } from '../../exportable/Interval/Month';
import { EcheanceRepositoryInterface } from '../../infra/typeorm/echeance/EcheanceRepository';
import { Prevision } from '../../models/Prevision';
import { Echeance } from '../../models/Echeance';
import { RulesServiceInterface } from '../RulesService/RulesService';

export interface PrevisionsServiceInterface {
  getAllBetweenDates: (start: Month, end: Month) => Promise<Prevision[]>;
  getEcheancesInInterval: (interval: Interval) => Promise<Echeance[]>;
  getEcheancierIds: () => Promise<{ id: number; category: number }[]>;
}

export const PrevisionsService = (
  echeanceRepository: EcheanceRepositoryInterface,
  rulesService: RulesServiceInterface,
): PrevisionsServiceInterface => {
  return {
    getAllBetweenDates: async (start: Month, end: Month) => {
      const rules = await rulesService.getApplyingBetween(start, end);
      console.log(rules);
      // start = NULL ou avant start
      // end = NULL ou après end
      return [];
    },
    getEcheancesInInterval: (interval: Interval) => {
      return echeanceRepository.inInterval(interval);
    },
    getEcheancierIds: () => {
      return echeanceRepository.getEcheancierIds();
    },
  };
};
