import './PrevisionsSelect.scss';
import { FC, useContext } from 'react';
import { PrevisionRules } from '../../interfaces/extraits';
import { AppContext } from '../../Pages/AppContext';
import { treeFindById } from '../../exportable/Hierarchie/Tree';

interface Props {
  previsions: PrevisionRules[];
  value: number | undefined;
  onSelect: (id: number | undefined) => void;
}

const PrevisionsSelect: FC<Props> = ({ previsions, value, onSelect }) => {
  const { state } = useContext(AppContext);
  return (
    <ul className="prevision-select">
      {previsions.map((prevision) => (
        <li key={prevision.id} onClick={() => onSelect(prevision.id)}>
          {treeFindById<{ name: string }>(state.availableCategories, prevision.categoryId)?.name}
        </li>
      ))}
    </ul>
  );
};

export default PrevisionsSelect;
