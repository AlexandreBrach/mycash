import { PrevisionRules, Echeance } from '../interfaces/extraits';
import { rulesToEcheances } from './previsions';

const sortFunc = (e1: Echeance, e2: Echeance) => {
  const c = (e: Echeance) => e.categoryId + e.amount + e.amount.toString();
  return c(e1) < c(e2) ? -1 : 1;
};

it('previsions matrix', () => {
  const rules: PrevisionRules[] = [
    {
      id: 1,
      categoryId: '1',
      categoryName: 'EDF',
      period: 1,
      amount: 280.0,
      start: new Date('2023/11/1'),
      end: undefined,
    },
    {
      id: 4,
      categoryId: '24',
      categoryName: 'Internet',
      period: 3,
      amount: 25.0,
      start: new Date('2023/11/1'),
      end: undefined,
    },
    {
      id: 5,
      categoryId: '13',
      categoryName: 'Courses',
      period: 1,
      amount: 600.0,
      start: new Date('2023/11/1'),
      end: undefined,
    },
    {
      id: 2,
      categoryId: '20',
      categoryName: 'Prêt immobilier',
      period: 1,
      amount: 538.7,
      start: new Date('2023/11/1'),
      end: undefined,
    },
    {
      id: 16,
      categoryId: '105',
      categoryName: 'Facture eau',
      period: 12,
      amount: -180.0,
      start: new Date('2024/10/1'),
      end: undefined,
    },
  ];

  const expected: Echeance[] = [
    {
      date: '2024-1',
      amount: 280.0,
      categoryId: '1',
    },
    {
      date: '2024-1',
      amount: 600.0,
      categoryId: '13',
    },
    {
      date: '2024-1',
      amount: 538.7,
      categoryId: '20',
    },

    {
      date: '2024-2',
      amount: 280.0,
      categoryId: '1',
    },
    {
      date: '2024-2',
      amount: 25.0,
      categoryId: '24',
    },
    {
      date: '2024-2',
      amount: 600.0,
      categoryId: '13',
    },
    {
      date: '2024-2',
      amount: 538.7,
      categoryId: '20',
    },

    {
      date: '2024-3',
      amount: 280.0,
      categoryId: '1',
    },
    {
      date: '2024-3',
      amount: 600.0,
      categoryId: '13',
    },
    {
      date: '2024-3',
      amount: 538.7,
      categoryId: '20',
    },

    {
      date: '2024-4',
      amount: 280.0,
      categoryId: '1',
    },
    {
      date: '2024-4',
      amount: 600.0,
      categoryId: '13',
    },
    {
      date: '2024-4',
      amount: 538.7,
      categoryId: '20',
    },

    {
      date: '2024-5',
      amount: 280.0,
      categoryId: '1',
    },
    {
      date: '2024-5',
      amount: 25.0,
      categoryId: '24',
    },
    {
      date: '2024-5',
      amount: 600.0,
      categoryId: '13',
    },
    {
      date: '2024-5',
      amount: 538.7,
      categoryId: '20',
    },

    {
      date: '2024-6',
      amount: 280.0,
      categoryId: '1',
    },
    {
      date: '2024-6',
      amount: 600.0,
      categoryId: '13',
    },
    {
      date: '2024-6',
      amount: 538.7,
      categoryId: '20',
    },

    {
      date: '2024-7',
      amount: 280.0,
      categoryId: '1',
    },
    {
      date: '2024-7',
      amount: 600.0,
      categoryId: '13',
    },
    {
      date: '2024-7',
      amount: 538.7,
      categoryId: '20',
    },

    {
      date: '2024-8',
      amount: 280.0,
      categoryId: '1',
    },
    {
      date: '2024-8',
      amount: 25.0,
      categoryId: '24',
    },
    {
      date: '2024-8',
      amount: 600.0,
      categoryId: '13',
    },
    {
      date: '2024-8',
      amount: 538.7,
      categoryId: '20',
    },

    {
      date: '2024-9',
      amount: 280.0,
      categoryId: '1',
    },
    {
      date: '2024-9',
      amount: 600.0,
      categoryId: '13',
    },
    {
      date: '2024-9',
      amount: 538.7,
      categoryId: '20',
    },

    {
      date: '2024-10',
      amount: 280.0,
      categoryId: '1',
    },
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

  const result = rulesToEcheances(rules, 0, 2024);

  expect(result.sort(sortFunc)).toStrictEqual(expected.sort(sortFunc));
});

it('previsions : end date', () => {
  const rules: PrevisionRules[] = [
    {
      id: 1,
      categoryId: '1',
      categoryName: 'EDF',
      period: 1,
      amount: 280.0,
      start: new Date('2023/11/1'),
      end: new Date('2024/4/1'),
    },
  ];

  const expected: Echeance[] = [
    {
      date: '2024-1',
      amount: 280.0,
      categoryId: '1',
    },
    {
      date: '2024-2',
      amount: 280.0,
      categoryId: '1',
    },
    {
      date: '2024-3',
      amount: 280.0,
      categoryId: '1',
    },
    {
      date: '2024-4',
      amount: 280.0,
      categoryId: '1',
    },
  ];

  const result = rulesToEcheances(rules, 0, 2024);

  expect(result.sort(sortFunc)).toStrictEqual(expected.sort(sortFunc));
});

it('previsions : start date', () => {
  const rules: PrevisionRules[] = [
    {
      id: 1,
      categoryId: '1',
      categoryName: 'impot',
      period: 1,
      amount: 66.0,
      start: new Date('2024/4/1'),
      end: undefined,
    },
  ];

  const expected: Echeance[] = [
    {
      date: '2024-4',
      amount: 66.0,
      categoryId: '1',
    },
    {
      date: '2024-5',
      amount: 66.0,
      categoryId: '1',
    },
    {
      date: '2024-6',
      amount: 66.0,
      categoryId: '1',
    },
    {
      date: '2024-7',
      amount: 66.0,
      categoryId: '1',
    },
    {
      date: '2024-8',
      amount: 66.0,
      categoryId: '1',
    },
    {
      date: '2024-9',
      amount: 66.0,
      categoryId: '1',
    },
    {
      date: '2024-10',
      amount: 66.0,
      categoryId: '1',
    },
    {
      date: '2024-11',
      amount: 66.0,
      categoryId: '1',
    },
    {
      date: '2024-12',
      amount: 66.0,
      categoryId: '1',
    },
  ];

  const result = rulesToEcheances(rules, 0, 2024);

  expect(result.sort(sortFunc)).toStrictEqual(expected.sort(sortFunc));
});
