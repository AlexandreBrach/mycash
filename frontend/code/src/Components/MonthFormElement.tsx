import { ComponentPropsWithoutRef, FC, useContext } from 'react';
import { AppContext } from '../Pages/AppContext';
import { MonthData } from '../interfaces/extraits';

interface Props extends ComponentPropsWithoutRef<"select"> {
    onChange: (e: unknown | null) => void;
    value: string | undefined;
}

const MonthFormElement: FC<Props> = ({ onChange, value }) => {

    const { state } = useContext(AppContext);

    const months = state.availableMonths;

    const isEmpty = months.length === 0;

    const handleChange = (value: string) => {
        onChange(value);
    }

    return isEmpty ? '' : <select
        value={value}
        onChange={(e) => handleChange(e.target.value)}>
        {months.map((month: MonthData) => <option key={month.value} value={month.value} >
            {month.label}
        </option>
        )}
    </select>
}

export default MonthFormElement;