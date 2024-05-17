import { getPrevisionsMonthTotal } from './previsions';

it('total from echeances', () => {
  const echeances = [
    {
      date: '2024-10',
      amount: 600.0,
      categoryId: '13',
    },
    {
      date: '2024-10',
      amount: 538.7,
      categoryId: '20',
    },
    {
      date: '2024-10',
      amount: -180.0,
      categoryId: '105',
    },

    {
      date: '2024-11',
      amount: 280.0,
      categoryId: '1',
    },
    {
      date: '2024-11',
      amount: 25.0,
      categoryId: '24',
    },
    {
      date: '2024-11',
      amount: 600.0,
      categoryId: '13',
    },
    {
      date: '2024-11',
      amount: 538.7,
      categoryId: '20',
    },

    {
      date: '2024-12',
      amount: 280.0,
      categoryId: '1',
    },
    {
      date: '2024-12',
      amount: 600.0,
      categoryId: '13',
    },
    {
      date: '2024-12',
      amount: 538.7,
      categoryId: '20',
    },
  ];

  const expected = [
    {
      date: '2024-10',
      amount: 958.7,
      categoryId: 'TOTAL',
    },
    {
      date: '2024-11',
      amount: 1443.7,
      categoryId: 'TOTAL',
    },
    {
      date: '2024-12',
      amount: 1418.7,
      categoryId: 'TOTAL',
    },
  ];

  const result = getPrevisionsMonthTotal(echeances);

  expect(result).toEqual(expected);
});
