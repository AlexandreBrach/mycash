import { FlatTree } from '../exportable/Hierarchie/Tree';
import { Echeance, PrevisionRules } from '../interfaces/extraits';

/**
 * Return the month when rule apply between two date
 *
 */
export const getRuleApplicationMonth = (rule: PrevisionRules, dateStart: Date, dateEnd: Date): string[] => {
  const getMonthsNumber = (d: Date) => d.getFullYear() * 12 + d.getMonth();

  const result: string[] = [];

  const ruleEndDate = rule.end !== undefined ? rule.end : new Date('2100/2/1');
  if (rule.start > dateStart) {
    dateStart = rule.start;
  }

  // nombre de mois entre ruleStartDate et dateStart
  const diff = getMonthsNumber(dateStart) - getMonthsNumber(rule.start);
  const months = diff >= 0 ? diff : diff + 12;

  const modulo = months % rule.period;
  // modulo period => si 0, firstDate = dateStart, sinon dateStart.addMonth( period-modulo )
  const firstDate = new Date(dateStart);
  if (modulo !== 0) {
    firstDate.setMonth(firstDate.getMonth() + rule.period - modulo);
  }

  while (firstDate < dateEnd && firstDate <= ruleEndDate) {
    result.push(`${firstDate.getFullYear()}-${firstDate.getMonth() + 1}`);
    firstDate.setMonth(firstDate.getMonth() + rule.period);
  }

  return result;
};

/**
 * Convert previsions rules to a table of echeances
 * startMonth Janvier=0
 *
 * @param rules
 * @param startMonth
 * @param startYear
 * @param length
 * @returns
 */
export const rulesToEcheances = (
  rules: PrevisionRules[],
  startMonth: number,
  startYear: number,
  length: number = 12,
): Echeance[] => {
  const startDate = new Date(`${startYear}/${startMonth + 1}/1`);
  let response: Echeance[] = [];

  const limitDate = new Date(`${startYear}/${startMonth + 1}/1`);
  limitDate.setMonth(startDate.getMonth() + length);

  rules.forEach((rule) => {
    response = [
      ...response,
      ...getRuleApplicationMonth(rule, startDate, limitDate).map((month: string) => ({
        date: month,
        categoryId: rule.categoryId,
        amount: rule.amount,
      })),
    ];
  });

  return response;
};

/**
 * Return the previsions amount for the selected month
 *
 * @param rule
 * @param month
 * @param year
 * @returns
 */
export const getMonthPrevisionAmount = (rule: PrevisionRules, month: number, year: number): number => {
  const months = month + year * 12;
  const startMonths = rule.start.getMonth() + rule.start.getFullYear() * 12;

  if (months < startMonths) {
    return 0;
  }

  if (rule.end) {
    if (months > rule.end.getMonth() + rule.end.getFullYear() * 12) {
      return 0;
    }
  }

  return (month - startMonths) % rule.period === 0 ? rule.amount : 0;
};

/**
 * Get all prevision amounts for the given month
 *
 * @param rules
 * @param month
 * @param year
 * @returns
 */
export const getMonthPrevisions = (
  rules: PrevisionRules[],
  month: number,
  year: number,
): FlatTree<{ value: number }> => {
  return rules
    .map((rule) => {
      return {
        id: rule.categoryId,
        data: {
          value: getMonthPrevisionAmount(rule, month, year),
        },
      };
    })
    .filter((item) => item.data.value !== 0);
};

/**
 * return the total echeances amount grouped by date
 * The resulting Echeance categoryId is 'TOTAL'
 *
 * @param echeances
 * @returns
 */
export const getPrevisionsMonthTotal = (echeances: Echeance[]): Echeance[] => {
  // tmp will store the cumul for each month
  let tmp: Record<string, number> = {};
  echeances.forEach((e) => {
    const index = `${e.date.split('-')[0]}-${parseInt(e.date.split('-')[1])}`;
    return (tmp[index] = tmp[index] === undefined ? e.amount : (tmp[index] += e.amount));
  });
  return Object.keys(tmp).map(
    (date): Echeance => ({
      date,
      categoryId: 'TOTAL',
      amount: tmp[date],
    }),
  );
};

/**
 * replace any doublons of date/category with their montant sums
 *
 * @param echeances
 * @returns
 */
export const factorizePrevisions = (echeances: Echeance[]): Echeance[] => {
  return echeances
    .filter(
      // unique couple categoryId / date
      (e, i, array) => array.findIndex((e2) => e2.date === e.date && e2.categoryId === e.categoryId) === i,
    )
    .map((u: Echeance) =>
      // cumul the matching categoryId / date
      echeances
        .filter((e: Echeance) => e.categoryId === u.categoryId && e.date === u.date)
        .reduce((prev, curr) => ({ ...prev, amount: (prev.amount += curr.amount) }), { ...u, amount: 0 }),
    );
};
