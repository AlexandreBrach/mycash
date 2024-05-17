import './PrevisionTable.scss';
import { FC, useContext } from 'react';
import { AppContext } from '../Pages/AppContext';
import factory from '../services/Factory';
import { getPrevisionsMonthTotal } from '../helpers/previsions';
import Montant from './Montant';
import { treeFlatten } from '../exportable/Hierarchie/Tree';
import { BiSolidChevronLeftCircle, BiSolidChevronRightCircle } from 'react-icons/bi';
import { Echeance } from '../interfaces/extraits';

interface Props {
  echeanceTable: Echeance[];
  startDate: Date;
  onChangeStartDate: (value: Date) => void;
  columnNumber: number;
}

const PrevisionTable: FC<Props> = ({ echeanceTable, startDate, onChangeStartDate, columnNumber }) => {
  const handleLeft = () => {
    onChangeStartDate(new Date(startDate.getFullYear(), startDate.getMonth() - 1));
  };

  const handleRight = () => {
    onChangeStartDate(new Date(startDate.getFullYear(), startDate.getMonth() + 1));
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

  const months = [...Array(columnNumber).keys()].map(
    (n) => new Date(startDate.getFullYear(), startDate.getMonth() + n),
  );

  const simplifiedMonth = months.map((m) => `${m.getFullYear()}-${m.getMonth() + 1}`);

  return (
    <table className="previsions">
      <thead>
        <tr>
          <th></th>
          {simplifiedMonth.map((month, i) => (
            <th key={month}>
              {i === 0 && (
                <BiSolidChevronLeftCircle className="icon-button" style={{ float: 'left' }} onClick={handleLeft} />
              )}
              {formatService.renderMonthFromSimplified(month)}
              {i === Object.keys(simplifiedMonth).length - 1 && (
                <BiSolidChevronRightCircle className="icon-button" style={{ float: 'right' }} onClick={handleRight} />
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {categoriesId.map((categoryId) => (
          <tr key={categoryId}>
            <td>{flat.find((v) => v.id === categoryId)!.data.name}</td>
            {simplifiedMonth.map((month) => (
              <td key={`${categoryId}${month}`}>
                {
                  <Montant
                    value={echeanceTable
                      .filter(
                        (e) =>
                          e.categoryId === categoryId &&
                          // @TODO : clean this awful stuff once real-date based
                          `${e.date.split('-')[0]}-${parseInt(e.date.split('-')[1])}` === month,
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
          {simplifiedMonth.map((month: string) => {
            const total = totals.filter(
              // @TODO : clean this awful stuff once real-date based
              (e) => `${e.date.split('-')[0]}-${parseInt(e.date.split('-')[1])}` === month,
            )[0];
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
