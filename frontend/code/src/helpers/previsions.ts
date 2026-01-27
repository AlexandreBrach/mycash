import { FlatTree } from '../exportable/Hierarchie/Tree';
import { Interval } from '../exportable/Interval/Interval';
import { Month } from '../exportable/Interval/Month';
import { Echeance, PrevisionRules } from '../interfaces/extraits';

/**
 * Return the month when rule apply between two date
 *
 */
export const getRuleApplicationMonth = (rule: PrevisionRules, dateStart: Month, dateEnd: Month): Month[] => {
  const result: Month[] = [];

  const ruleEndDate = rule.end !== undefined ? rule.end : new Date('2100/2/1');
  if (rule.start > dateStart) {
    dateStart = rule.start;
  }

  // nombre de mois entre ruleStartDate et dateStart
  const months = dateStart.diff(rule.start);

  const modulo = months % rule.period;
  // modulo period => si 0, firstDate = dateStart, sinon dateStart.addMonth( period-modulo )
  const first = dateStart.clone();
  if (modulo !== 0) {
    first.setMonth(first.getDate().getUTCMonth() + rule.period - modulo);
  }

  while (first < dateEnd && first <= ruleEndDate) {
    result.push(first.nextMonth());
    first.setMonth(first.getDate().getUTCMonth() + rule.period);
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
  const startDate = Month.fromMonthAndYear(startYear, startMonth);

  let response: Echeance[] = [];

  const limitDate = startDate.nextMonth(length);

  rules.forEach((rule) => {
    response = [
      ...response,
      ...getRuleApplicationMonth(rule, startDate, limitDate).map((month: Month) => ({
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
export const getMonthPrevisionAmount = (rule: PrevisionRules, month: Month): number => {
  if (month.getDate() < rule.start.getDate()) {
    return 0;
  }

  if (rule.end) {
    if (month.getDate() > rule.end.getDate()) {
      return 0;
    }
  }
  const interval = new Interval(rule.start.getDate(), month.getDate());
  return interval.countMonths() % rule.period === 0 ? rule.amount : 0;
};

/**
 * Get all prevision amounts for the given month
 *
 * @param rules
 * @param month
 * @param year
 * @returns
 */
export const getMonthPrevisions = (rules: PrevisionRules[], month: Month): FlatTree<{ value: number }> => {
  return rules
    .map((rule) => {
      return {
        id: rule.categoryId,
        data: {
          value: getMonthPrevisionAmount(rule, month),
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
    const index = e.date.getDate().valueOf();
    return (tmp[index] = tmp[index] === undefined ? e.amount : (tmp[index] += e.amount));
  });
  return Object.keys(tmp).map(
    (date): Echeance => ({
      date: new Month(new Date(date)),
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
