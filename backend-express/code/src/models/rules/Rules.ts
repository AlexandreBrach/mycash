export interface RulesProperties {
  id: number;
  categoryId: string;
  categoryName: string;
  period: number;
  amount: number;
  start: Date;
  end: Date | null;
}

export class Rules implements RulesProperties {
  id: number;
  categoryId: string;
  categoryName: string;
  period: number;
  amount: number;
  start: Date;
  end: Date | null;

  constructor(props: RulesProperties) {
    Object.assign(this, props);
  }
}
