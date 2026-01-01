import { Interval } from '../../helpers/interval';
import { Echeance } from '../../infra/typeorm/echeance/echeance';
import { EcheanceRepositoryInterface } from '../../infra/typeorm/echeance/EcheanceRepository';
import { GenericRepositoryInterface } from '../../infra/typeorm/GenericRepository';
import { Prevision } from '../../infra/typeorm/prevision/prevision';

export interface PrevisionsServiceInterface {
  getAll: () => Promise<Prevision[]>;
  getEcheancesInInterval: (interval: Interval) => Promise<Echeance[]>;
  getEcheancierIds: () => Promise<{ id: number; category: number }[]>;
}

export const PrevisionsService = (
  previsionRepository: GenericRepositoryInterface<Prevision>,
  echeanceRepository: EcheanceRepositoryInterface,
): PrevisionsServiceInterface => {
  return {
    getAll: async () => {
      return previsionRepository.getAll();
    },
    getEcheancesInInterval: (interval: Interval) => {
      return echeanceRepository.inInterval(interval);
    },
    getEcheancierIds: () => {
      return echeanceRepository.getEcheancierIds();
    },
  };
};
