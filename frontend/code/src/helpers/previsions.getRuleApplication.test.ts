import { PrevisionRules } from '../interfaces/extraits';
import { getRuleApplicationMonth } from './previsions';

it('previsions matrix', () => {
  const rules: PrevisionRules = {
    id: 1,
    categoryId: '1',
    categoryName: 'EDF',
    period: 1,
    amount: 280.0,
    start: new Date('2023/11/1'),
    end: undefined,
  };

  const expected: string[] = [
    '2023-11',
    '2023-12',
    '2024-1',
    '2024-2',
    '2024-3',
    '2024-4',
    '2024-5',
    '2024-6',
    '2024-7',
    '2024-8',
    '2024-9',
    '2024-10',
  ];

  const result = getRuleApplicationMonth(rules, new Date('2023/11/02'), new Date('2024/11/02'));

  expect(result).toStrictEqual(expected);
});

it('previsions matrix every 3 months', () => {
  const rules: PrevisionRules = {
    id: 1,
    categoryId: '1',
    categoryName: 'EDF',
    period: 3,
    amount: 280.0,
    start: new Date('2023/11/1'),
    end: undefined,
  };

  const expected: string[] = ['2023-11', '2024-2', '2024-5', '2024-8', '2024-11'];

  const result = getRuleApplicationMonth(rules, new Date('2023/11/02'), new Date('2024/11/15'));

  expect(result).toStrictEqual(expected);
});

it('previsions matrix every 4 months, with offset', () => {
  const rules: PrevisionRules = {
    id: 1,
    categoryId: '1',
    categoryName: 'EDF',
    period: 4,
    amount: 280.0,
    start: new Date('2023/10/1'),
    end: undefined,
  };

  const expected: string[] = ['2024-2', '2024-6', '2024-10'];

  const result = getRuleApplicationMonth(rules, new Date('2023/11/02'), new Date('2024/11/02'));

  expect(result).toStrictEqual(expected);
});

it('previsions matrix every 4 months, with offset next year', () => {
  const rules: PrevisionRules = {
    id: 16,
    categoryId: '105',
    categoryName: 'Facture eau',
    period: 12,
    amount: -180.0,
    start: new Date('2024/10/1'),
    end: undefined,
  };

  const expected: string[] = ['2024-10'];

  const result = getRuleApplicationMonth(rules, new Date('2024/01/02'), new Date('2024/12/02'));

  expect(result).toStrictEqual(expected);
});

it('previsions matrix with offset, rule defined more than 1 years', () => {
  const rules: PrevisionRules = {
    id: 1,
    categoryId: '1',
    categoryName: 'EDF',
    period: 3,
    amount: 280.0,
    start: new Date('2022/10/1'),
    end: undefined,
  };

  const expected: string[] = ['2024-1', '2024-4', '2024-7', '2024-10'];

  const result = getRuleApplicationMonth(rules, new Date('2023/11/02'), new Date('2024/11/02'));

  expect(result).toStrictEqual(expected);
});

it('start after begining of interval', () => {
  const rules: PrevisionRules = {
    id: 1,
    categoryId: '1',
    categoryName: 'impot',
    period: 1,
    amount: 66.0,
    start: new Date('2024/4/1'),
    end: undefined,
  };

  const expected: string[] = ['2024-4', '2024-5', '2024-6', '2024-7', '2024-8', '2024-9', '2024-10', '2024-11'];

  const result = getRuleApplicationMonth(rules, new Date('2023/11/02'), new Date('2024/11/02'));

  expect(result).toStrictEqual(expected);
});
