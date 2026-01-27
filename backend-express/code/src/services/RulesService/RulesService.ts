import { GenericRepositoryInterface } from '../../infra/typeorm/GenericRepository';
import { Rule } from '../../models/rules/Rules';

export interface RulesServiceInterface {
  getAll: () => Promise<Rule[]>;
}

export const RulesService = (rulesRepository: GenericRepositoryInterface<Rule>): RulesServiceInterface => {
  return {
    getAll: async () => {
      return rulesRepository.getAll();
    },
  };
};
