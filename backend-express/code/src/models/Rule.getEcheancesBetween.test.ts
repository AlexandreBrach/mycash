import { Month } from '../exportable/Interval/Month';
import { Rule } from './Rule';

it('monthly rules', () => {
  const rule = new Rule({
    amount: 500,
    categoryId: 666,
    start: new Date(Date.UTC(2010, 1)),
    end: new Date(Date.UTC(2030, 8)),
    id: 100,
    period: 1,
  });

  const echeances = rule.getEcheancesBetween(
    new Month(new Date(Date.UTC(2019, 10))),
    new Month(new Date(Date.UTC(2020, 3))),
  );

  const commonProps = {
    id: null,
    amount: 500,
    collection: null,
    categoryId: 666,
  };

  const props = echeances.map((e) => e.raw());

  expect(props).toEqual([
    {
      ...commonProps,
      dueDate: new Date(Date.UTC(2019, 10)),
    },
    {
      ...commonProps,
      dueDate: new Date(Date.UTC(2019, 11)),
    },
    {
      ...commonProps,
      dueDate: new Date(Date.UTC(2020, 0)),
    },
    {
      ...commonProps,
      dueDate: new Date(Date.UTC(2020, 1)),
    },
    {
      ...commonProps,
      dueDate: new Date(Date.UTC(2020, 2)),
    },
    {
      ...commonProps,
      dueDate: new Date(Date.UTC(2020, 3)),
    },
  ]);
});

it('rules echeances generation with decalage', () => {
  const rule = new Rule({
    amount: 500,
    categoryId: 666,
    start: new Date(Date.UTC(2020, 1)),
    end: new Date(Date.UTC(2020, 8)),
    id: 100,
    period: 2,
  });

  const echeances = rule.getEcheancesBetween(
    new Month(new Date(Date.UTC(2019, 10))),
    new Month(new Date(Date.UTC(2021, 11))),
  );

  const props = echeances.map((e) => e.raw());

  const commonProps = {
    id: null,
    amount: 500,
    collection: null,
    categoryId: 666,
  };

  expect(props).toEqual([
    {
      ...commonProps,
      dueDate: new Date(Date.UTC(2020, 1)),
    },
    {
      ...commonProps,
      dueDate: new Date(Date.UTC(2020, 3)),
    },
    {
      ...commonProps,
      dueDate: new Date(Date.UTC(2020, 5)),
    },
    {
      ...commonProps,
      dueDate: new Date(Date.UTC(2020, 7)),
    },
    {
      ...commonProps,
      dueDate: new Date(Date.UTC(2020, 9)),
    },
    {
      ...commonProps,
      dueDate: new Date(Date.UTC(2020, 11)),
    },
    {
      ...commonProps,
      dueDate: new Date(Date.UTC(2021, 1)),
    },
    {
      ...commonProps,
      dueDate: new Date(Date.UTC(2021, 3)),
    },
    {
      ...commonProps,
      dueDate: new Date(Date.UTC(2021, 5)),
    },
    {
      ...commonProps,
      dueDate: new Date(Date.UTC(2021, 7)),
    },
    {
      ...commonProps,
      dueDate: new Date(Date.UTC(2021, 9)),
    },
    {
      ...commonProps,
      dueDate: new Date(Date.UTC(2021, 11)),
    },
  ]);
});
