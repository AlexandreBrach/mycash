import { ComponentPropsWithoutRef, FC, useContext } from 'react';
import { AppContext } from '../Pages/AppContext';
import { Month } from '../exportable/Interval/Month';
import { renderMonth } from '../helpers/format';

interface Props extends ComponentPropsWithoutRef<'select'> {
  changeAction: (e: Month) => void;
  selected: Month | undefined;
}

const MonthFormElement: FC<Props> = ({ changeAction, selected }) => {
  const { state } = useContext(AppContext);

  const isEmpty = state.availableMonths.length === 0;

  const handleChange = (value: string) => {
    const timestamp = parseInt(value);
    changeAction(new Month(new Date(timestamp)));
  };

  return isEmpty ? (
    ''
  ) : (
    <select value={selected?.getDate().valueOf()} onChange={(e) => handleChange(e.target.value)}>
      {state.availableMonths.map((month: Month) => (
        <option key={month?.getDate().valueOf()} value={month?.getDate().valueOf()}>
          {month ? renderMonth(month.getDate()) : undefined}
        </option>
      ))}
    </select>
  );
};

export default MonthFormElement;
