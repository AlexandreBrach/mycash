import { Interval } from './Interval';

export class Month {
  protected date: Date;
  constructor(date = new Date()) {
    this.date = new Date(date);
    this.date.setUTCDate(1);
    this.date.setUTCHours(0);
    this.date.setUTCMinutes(0);
    this.date.setUTCSeconds(0);
    this.date.setUTCMilliseconds(0);
  }

  /**
   * Create a month from string at format YYYY-MM
   *
   * @param s string representation at format YYYY-MM
   * @returns Month
   */
  static fromString(s: string): Month {
    const [year, month] = s.split('-');
    const date = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1));
    return new Month(date);
  }

  /**
   * Create a month from month/year number
   * /!\ month number begin with 0 !
   *
   * @param s string representation at format YYYY-MM
   * @returns Month
   */

  static fromMonthAndYear(month: number, year: number) {
    const date = new Date(Date.UTC(year, month, 1));
    return new Month(date);
  }

  /**
   * return YYYY-MM date representation
   * @returns string
   */
  public toString(): string {
    const year = this.date.getUTCFullYear();
    const month = this.date.getUTCMonth() + 1;
    return `${year}-${month.toString().padStart(2, '0')}`;
  }

  public getDate(): Date {
    return this.date;
  }
  public getEndDate(): Date {
    return new Date(
      Date.UTC(
        this.date.getUTCFullYear(),
        this.date.getUTCMonth() + 1,
        0, // dernier jour du mois
        23,
        59,
        59,
        999,
      ),
    );
  }
  public getInterval(): Interval {
    return new Interval(this.date, this.getEndDate());
  }

  public nextMonth(n: number = 1): Month {
    const d = new Date(this.date);
    d.setUTCDate(1);
    d.setUTCMonth(d.getUTCMonth() + n);

    const lastDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
    d.setUTCDate(Math.min(this.date.getUTCDate(), lastDay));

    return new Month(d);
  }

  public setMonth(m: number) {
    this.date.setUTCMonth(m);
  }

  public setYear(y: number) {
    this.date.setUTCFullYear(y);
  }

  /**
   * Return number of month between two month, negative if the passed month is before.
   *
   * @param bound other date
   * @returns number
   */
  public diff(bound: Month): number {
    return (
      (bound.date.getUTCFullYear() - this.date.getUTCFullYear()) * 12 +
      (bound.date.getUTCMonth() - this.date.getUTCMonth())
    );
  }

  public clone(): Month {
    return new Month(this.date);
  }
}
