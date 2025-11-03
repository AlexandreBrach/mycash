import { GenericRepositoryInterface } from '../../infra/typeorm/GenericRepository';
import { Rules } from '../../infra/typeorm/rules/rules';

export interface PrevisionsServiceInterface {
  getAllRules: () => Promise<Rules[]>;
}

export const PrevisionsService = (RulesRepository: GenericRepositoryInterface<Rules>): PrevisionsServiceInterface => {
  return {
    getAllRules: async (): Promise<Rules[]> => RulesRepository.getAll(),
  };
};
