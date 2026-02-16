import { Month } from '../../exportable/Interval/Month';
import { Rule } from '../../models/Rule';
import { RuleRepositoryInterface } from '../../infra/typeorm/rules/RuleRepository';

export interface RulesServiceInterface {
  getAll: () => Promise<Rule[]>;
  getApplyingAfter: (after: Month) => Promise<Rule[]>;
  getApplyingBetween: (start: Month, end: Month) => Promise<Rule[]>;
  update: (id: number, rule: Rule) => Promise<Rule>;
}

export const RulesService = (rulesRepository: RuleRepositoryInterface): RulesServiceInterface => {
  const getAll = async () => {
    return rulesRepository.getAll();
  };

  const getApplyingBetween = async (start: Month, end: Month): Promise<Rule[]> => {
    return await rulesRepository.getRulesApplyingBetween(start, end);
  };

  const getApplyingAfter = async (after: Month): Promise<Rule[]> => {
    return await rulesRepository.getRulesApplyingAfter(after);
  };

  const update = async (id: number, rule: Rule) => {
    return rulesRepository.update(id, rule);
  };

  return {
    getAll,
    getApplyingBetween,
    getApplyingAfter,
    update,
  };
};
