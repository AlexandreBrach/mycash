import { Rule } from '../../models/rules/Rules';

export const RuleAssembler = (rule: Rule | Rule[]): any => {
  if (Array.isArray(rule)) {
    return rule.map(RuleAssembler);
  }

  return {
    ...rule,
    id: rule.id.toString(),
  };
};
