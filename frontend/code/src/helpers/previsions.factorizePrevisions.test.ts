import { Echeance } from '../interfaces/extraits';
import { factorizePrevisions } from './previsions';

it('sum of previsions', () => {
  const echeances = [
    {
      date: '2024-4',
      amount: -50,
      categoryId: '30',
    },
    {
      date: '2024-5',
      amount: -45,
      categoryId: '30',
    },
    {
      date: '2024-4',
      amount: -40,
      categoryId: '36',
    },
    {
      date: '2024-5',
      amount: -60,
      categoryId: '36',
    },
    {
      date: '2024-4',
      amount: -100,
      categoryId: '30',
    },
    {
      date: '2024-5',
      amount: -200,
      categoryId: '30',
    },
    {
      date: '2024-4',
      amount: -400,
      categoryId: '36',
    },
    {
      date: '2024-5',
      amount: -400,
      categoryId: '36',
    },
    {
      date: '2024-6',
      amount: -400,
      categoryId: '36',
    },
    {
      date: '2024-6',
      amount: -400,
      categoryId: '37',
    },
  ];

  const expected: Echeance[] = [
    {
      categoryId: '30',
      date: '2024-4',
      amount: -150,
    },
    {
      categoryId: '30',
      date: '2024-5',
      amount: -245,
    },
    {
      categoryId: '36',
      date: '2024-4',
      amount: -440,
    },
    {
      categoryId: '36',
      date: '2024-5',
      amount: -460,
    },
    {
      categoryId: '36',
      date: '2024-6',
      amount: -400,
    },
    { categoryId: '37', date: '2024-6', amount: -400 },
  ];

  const result = factorizePrevisions(echeances);

  expect(result).toEqual(expected);
});
