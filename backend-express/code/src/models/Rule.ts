export interface RuleProperties {
  id: number;
  categoryId: number;
  period: number;
  amount: number;
  start: Date;
  end: Date | null;
}

export class Rule {
  protected data: RuleProperties;

  constructor(props: RuleProperties) {
    this.data = props;
  }
  raw(): RuleProperties {
    return this.data;
  }
}
