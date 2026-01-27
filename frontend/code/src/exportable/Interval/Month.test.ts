import { Month } from './Month';
it('initialized with january', () => {
  const date = new Date(Date.UTC(2026, 0, 21));
  const month = new Month(date);
  const monthDate = month.getDate();
  expect(monthDate.getMonth()).toEqual(0);
  expect(monthDate.getDate()).toEqual(1);
});

it('initialized with march', () => {
  const date = new Date(Date.UTC(2026, 2, 1));
  const month = new Month(date);
  const monthDate = month.getDate();
  expect(monthDate.getMonth()).toEqual(2);
  expect(monthDate.getDate()).toEqual(1);
});

it('initialized from string', () => {
  const month = Month.fromString('2018-05');
  const monthDate = month.getDate();
  expect(monthDate.getFullYear()).toEqual(2018);
  expect(monthDate.getMonth()).toEqual(4);
  expect(monthDate.getDate()).toEqual(1);
});

it('initialized from string', () => {
  const date = new Date(Date.UTC(2013, 5, 24));
  const month = new Month(date);
  expect(month.toString()).toEqual('2013-06');
});

it('interval', () => {
  const month = new Month(new Date(Date.UTC(2011, 1, 3)));

  const interval = month.getInterval();

  expect(interval.getStart().toUTCString()).toEqual('Tue, 01 Feb 2011 00:00:00 GMT');
  expect(interval.getEnd().toUTCString()).toEqual('Mon, 28 Feb 2011 23:59:59 GMT');
});

it('next month', () => {
  const month = new Month(new Date(Date.UTC(2011, 1, 13)));
  const later = month.nextMonth(3);

  expect(later.getDate().toUTCString()).toEqual('Sun, 01 May 2011 00:00:00 GMT');
});

it('difference between month', () => {
  const month1 = new Month(new Date(Date.UTC(2011, 1, 3)));
  const month2 = new Month(new Date(Date.UTC(2013, 5, 24)));

  expect(month1.diff(month2)).toEqual(28);
});

it('difference between month (prev month)', () => {
  const month1 = new Month(new Date(Date.UTC(2013, 3, 24)));
  const month2 = new Month(new Date(Date.UTC(2013, 4, 24)));

  expect(month2.diff(month1)).toEqual(-1);
});
