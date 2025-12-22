import { GenericRepositoryInterface } from '../../infra/typeorm/GenericRepository';
import { Prevision } from '../../infra/typeorm/prevision/prevision';

export interface PrevisionsServiceInterface {
  getAll: () => Promise<Prevision[]>;
}

export const PrevisionsService = (
  previsionRepository: GenericRepositoryInterface<Prevision>,
): PrevisionsServiceInterface => {
  return {
    getAll: async () => {
      return previsionRepository.getAll();
    },
  };
};
