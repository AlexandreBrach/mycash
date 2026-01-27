export class Interval {
  constructor(
    public start: Date,
    public end: Date,
  ) {}

  /**************************** STATICS CONSTRUCTORS *******************************/

  static days(start: Date, days: number): Interval {
    const end = new Date(start);
    end.setUTCDate(start.getUTCDate() + days);
    return new Interval(start, end);
  }

  /**
   * Return interval matching the passed day
   *
   * @param day
   * @returns
   */
  public static day(day: Date): Interval {
    const start = new Date(day.setUTCHours(0, 0, 0, 0));
    const end = new Date(start);
    end.setUTCDate(start.getUTCDate() + 1);
    return new Interval(start, end);
  }

  public static around(date: Date, length: number): Interval {
    const start = new Date(date);
    start.setTime(start.getTime() - length / 2);
    const end = new Date(date);
    end.setTime(end.getTime() + length / 2);
    return new Interval(start, end);
  }

  /**************************** METHODS ******************************/

  public getStart(): Date {
    return new Date(this.start);
  }

  public getEnd(): Date {
    return new Date(this.end);
  }

  public endLimit(date: Date) {
    if (this.end > date) {
      this.end = new Date(date);
    }
  }

  public valuesOf(): { start: number; end: number } {
    return {
      start: this.start.valueOf(),
      end: this.end.valueOf(),
    };
  }

  public length(): number {
    return this.end.getTime() - this.start.getTime();
  }

  public recenter(center: Date) {
    const length = this.length();
    const diff = Math.floor(length / 2);
    this.start = new Date(center.getTime() - diff);
    this.end = new Date(center.getTime() + diff);
  }

  public countMonths() {
    return (
      (this.end.getUTCFullYear() - this.start.getUTCFullYear()) * 12 +
      (this.end.getUTCMonth() - this.start.getUTCMonth())
    );
  }

  public contain(date: Date) {
    return date.valueOf() >= this.start.valueOf() && date.valueOf() <= this.end.valueOf();
  }
}
