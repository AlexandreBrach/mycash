import { GenericRepositoryInterface } from '../../infra/typeorm/GenericRepository';
import { Rules } from '../../infra/typeorm/rules/rules';

export interface RulesServiceInterface {
  getAll: () => Promise<Rules[]>;
}

export const RulesService = (
  rulesRepository: GenericRepositoryInterface<Rules>,
): RulesServiceInterface => {
  return {
    getAll: async () => {
      return rulesRepository.getAll();
    },
  };
};
