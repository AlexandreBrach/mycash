import { Month } from '../../exportable/Interval/Month';
import { Echeance } from '../../models/Echeance';
import { Rule } from '../../models/Rule';
import { RuleRepositoryInterface } from '../../infra/typeorm/rules/RuleRepository';

export interface RulesServiceInterface {
  getAll: () => Promise<Rule[]>;
  getApplyingBetween: (start: Month, end: Month) => Promise<Echeance[]>;
}

export const RulesService = (rulesRepository: RuleRepositoryInterface): RulesServiceInterface => {
  const getAll = async () => {
    return rulesRepository.getAll();
  };

  const getApplyingBetween = async (start: Month, end: Month): Promise<Echeance[]> => {
    const rules = await rulesRepository.getRulesApplyingBetween(start, end);
    console.log(rules);
    return [];
  };

  return {
    getAll,
    getApplyingBetween,
  };
};
