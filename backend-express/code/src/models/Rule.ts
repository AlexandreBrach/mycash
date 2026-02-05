import { Month } from '../exportable/Interval/Month';
import { Echeance } from './Echeance';

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

  getEcheancesBetween(start: Month, end: Month): Echeance[] {
    const ruleStartMonth = new Month(this.data.start);
    let iterationMonth: Month =
      start.getDate() < this.data.start
        ? new Month(this.data.start)
        : start.nextMonth(this.data.period - (ruleStartMonth.diff(start) % this.data.period) - 1);
    const endTimestamp = end.getDate().valueOf();
    const response: Echeance[] = [];
    const echeanceProps = {
      id: null,
      amount: this.data.amount,
      categoryId: this.data.categoryId,
      collection: null,
    };
    while (iterationMonth.getDate().valueOf() <= endTimestamp) {
      response.push(
        new Echeance({
          ...echeanceProps,
          dueDate: iterationMonth.getDate(),
        }),
      );
      iterationMonth = iterationMonth.nextMonth(this.data.period);
    }
    return response;
  }
}
