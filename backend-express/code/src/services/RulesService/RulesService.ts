import { Month } from '../../exportable/Interval/Month';
import { Rule } from '../../models/Rule';
import { RuleRepositoryInterface } from '../../infra/typeorm/rules/RuleRepository';

export interface RulesServiceInterface {
  getAll: () => Promise<Rule[]>;
  getApplyingBetween: (start: Month, end: Month) => Promise<Rule[]>;
}

export const RulesService = (rulesRepository: RuleRepositoryInterface): RulesServiceInterface => {
  const getAll = async () => {
    return rulesRepository.getAll();
  };

  const getApplyingBetween = async (start: Month, end: Month): Promise<Rule[]> => {
    return await rulesRepository.getRulesApplyingBetween(start, end);
  };

  return {
    getAll,
    getApplyingBetween,
  };
};
