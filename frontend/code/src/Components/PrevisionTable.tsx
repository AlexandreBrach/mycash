import './PrevisionTable.scss';
import { FC, useContext, useEffect } from 'react';
import { AppContext } from '../Pages/AppContext';
import factory from '../services/Factory';
import { getPrevisionsMonthTotal } from '../helpers/previsions';
import Montant from './Montant';
import { treeFlatten } from '../exportable/Hierarchie/Tree';
import { BiSolidChevronLeftCircle, BiSolidChevronRightCircle } from 'react-icons/bi';
import { Echeance } from '../interfaces/extraits';
import { Month } from '../exportable/Interval/Month';

interface Props {
  echeanceTable: Echeance[];
  startMonth: Month;
  onChangeStartDate: (value: Month) => void;
  columnNumber: number;
  selectedMonth: Month | undefined;
  onSelectMonth: (m: Month) => void;
}

const PrevisionTable: FC<Props> = ({
  echeanceTable,
  startMonth,
  onChangeStartDate,
  columnNumber,
  selectedMonth,
  onSelectMonth,
}) => {
  const handleLeft = () => {
    onChangeStartDate(startMonth.nextMonth(-1));
  };

  const handleRight = () => {
    onChangeStartDate(startMonth.nextMonth());
  };

  const { state } = useContext(AppContext);

  const flat = treeFlatten(state.availableCategories);
  const formatService = factory.getFormatService();

  // categoriesId : first column of table, find all in every previsions
  let categoriesId: string[] = echeanceTable
    .map((e) => e.categoryId)
    // make unique
    .filter((val, i, array) => array.indexOf(val) === i);

  const totals = getPrevisionsMonthTotal(echeanceTable);

  const months: Month[] = [...Array(columnNumber).keys()].map((e) => startMonth.nextMonth(e));

  return (
    <table className="previsions">
      <thead>
        <tr>
          <th></th>
          {months.map((month: Month, i) => (
            <th
              key={month.toString()}
              onClick={() => {
                onSelectMonth(month);
              }}
              className={selectedMonth?.getDate().valueOf() === month.getDate().valueOf() ? 'selected' : ''}
            >
              {i === 0 && (
                <BiSolidChevronLeftCircle className="icon-button" style={{ float: 'left' }} onClick={handleLeft} />
              )}
              {formatService.renderMonth(month.getDate())}
              {i === Object.keys(months).length - 1 && (
                <BiSolidChevronRightCircle className="icon-button" style={{ float: 'right' }} onClick={handleRight} />
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {categoriesId.map((categoryId) => (
          <tr key={categoryId}>
            <td>{flat.find((v) => v.id === categoryId)?.data.name}</td>
            {months.map((month: Month) => (
              <td key={`${categoryId}${month}`}>
                {
                  <Montant
                    value={echeanceTable
                      .filter(
                        (e) => e.categoryId === categoryId && e.date.getDate().valueOf() === month.getDate().valueOf(),
                      )
                      .reduce((p, c) => p + c.amount, 0)}
                  />
                }
              </td>
            ))}
          </tr>
        ))}
        <tr>
          <td>TOTAL</td>
          {months.map((month: Month) => {
            const total = totals.filter((e) => e.date.getDate().valueOf() === month.getDate().valueOf())[0];
            return (
              <td key={`total${month}`}>
                <Montant value={total !== undefined ? total.amount : 0} />
              </td>
            );
          })}
        </tr>
      </tbody>
    </table>
  );
};

export default PrevisionTable;
