import { Interval } from './Interval';

describe('Interval Recenter', () => {
  it('should recenter the interval correctly (one day)', () => {
    const start = new Date('2023-10-01 00:00:00');
    const end = new Date('2023-10-02 00:00:00');
    const interval = new Interval(start, end);

    const center = new Date('2025-2-01 13:00:00');
    interval.recenter(center);

    const expectedStart = new Date('2025-2-01 01:00:00');
    const expectedEnd = new Date('2025-2-02 01:00:00');

    expect(interval.getStart()).toEqual(expectedStart);
    expect(interval.getEnd()).toEqual(expectedEnd);
  });

  it('should recenter the interval correctly (4h)', () => {
    const start = new Date('2025-10-01 00:00:00');
    const end = new Date('2025-10-01 04:00:00');
    const interval = new Interval(start, end);

    const center = new Date('2025-2-01 13:00:00');
    interval.recenter(center);

    const expectedStart = new Date('2025-2-01 11:00:00');
    const expectedEnd = new Date('2025-2-01 15:00:00');

    expect([interval.getStart(), interval.getEnd()]).toEqual([expectedStart, expectedEnd]);
  });
});

describe('Interval Around', () => {
  it('should create an interval around a date', () => {
    const interval = Interval.around(new Date('2023-10-01 12:00:00'), 60 * 1000);

    expect(interval.getStart()).toEqual(new Date('2023-10-01 11:59:30'));
    expect(interval.getEnd()).toEqual(new Date('2023-10-01 12:00:30'));
  });
});

describe('Interval month number', () => {
  it('return month number in interval', () => {
    const interval = new Interval(new Date(Date.UTC(2011, 1, 3)), new Date(Date.UTC(2013, 5, 24)));
    expect(interval.countMonths()).toEqual(28);
  });
});
