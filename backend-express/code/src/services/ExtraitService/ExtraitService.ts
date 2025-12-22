import { ExtraitRepositoryInterface } from '../../infra/typeorm/extrait/ExtraitRepository';

export interface ExtraitServiceInterface {
  getDistinctMonths: () => Promise<string[]>;
}

export const ExtraitService = (
  extraitRepository: ExtraitRepositoryInterface,
): ExtraitServiceInterface => {
  return {
    getDistinctMonths: async () => {
      return extraitRepository.getDistinctMonths();
    },
  };
};
