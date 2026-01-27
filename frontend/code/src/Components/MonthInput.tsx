import { FC } from 'react';
import { getMonthName } from '../helpers/format';
import { Month } from '../exportable/Interval/Month';

interface Props {
  value: Month;
  onChange: (value: Month) => void;
}

const MonthInput: FC<Props> = ({ value, onChange }) => {
  const year = value.getDate().getUTCFullYear();
  const month = value.getDate().getUTCMonth();

  const handleChangeMonth = (s: string) => {
    value.setMonth(parseInt(s));
    onChange(value);
  };

  const handleChangeYear = (s: string) => {
    value.setYear(parseInt(s));
    onChange(value);
  };

  return (
    <>
      <select onChange={(e) => handleChangeMonth(e.target.value)} value={month}>
        {[...Array(12).keys()]
          .map((n) => n + 1)
          .map((e) => getMonthName(e))
          .map((m, i) => (
            <option key={i} value={i + 1}>
              {m}
            </option>
          ))}
      </select>
      <select onChange={(e) => handleChangeYear(e.target.value)} value={year}>
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
