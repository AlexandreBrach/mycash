export interface RuleProperties {
  id: number;
  categoryId: string;
  categoryName: string;
  period: number;
  amount: number;
  start: Date;
  end: Date | null;
}

export class Rule implements RuleProperties {
  id!: number;
  categoryId!: string;
  categoryName!: string;
  period!: number;
  amount!: number;
  start!: Date;
  end!: Date | null;

  constructor(props: RuleProperties) {
    Object.assign(this, props);
  }
}
