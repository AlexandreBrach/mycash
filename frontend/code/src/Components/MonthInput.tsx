import { FC } from 'react';
import { getMonthName } from '../helpers/format';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const MonthInput: FC<Props> = ({ value, onChange }) => {
  const [year, month] = value.split('-');

  return (
    <>
      <select onChange={(e) => onChange(`${year}-${parseInt(e.target.value)}`)} value={parseInt(month)}>
        {[...Array(12).keys()]
          .map((n) => n + 1)
          .map((e) => getMonthName(e))
          .map((m, i) => (
            <option key={i} value={i + 1}>
              {m}
            </option>
          ))}
      </select>
      <select onChange={(e) => onChange(`${parseInt(e.target.value)}-${month}`)} value={parseInt(year)}>
        {[...Array(12).keys()]
          .map((n) => n + 2023)
          .map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
      </select>
    </>
  );
};

export default MonthInput;
