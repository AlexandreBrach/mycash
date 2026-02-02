import { Rule } from '../../models/Rule';

export const RuleAssembler = (rule: Rule | Rule[]): any => {
  if (Array.isArray(rule)) {
    return rule.map(RuleAssembler);
  }

  const props = rule.raw();
  return {
    ...props,
    id: props.id.toString(),
  };
};
