import "./PrevisionsSelect.scss"
import { FC } from "react";
import { PrevisionRules } from "../../interfaces/extraits";

interface Props {
  previsions: PrevisionRules[];
  value: number | undefined;
  onSelect: (id: number | undefined) => void;
}

const PrevisionsSelect: FC<Props> = ({ previsions, value, onSelect }) => {
  return (
    <ul className="prevision-select">
      {previsions.map((prevision) =>
        <li
          key={prevision.id}
          onClick={() => onSelect(prevision.id)}>
          {prevision.categoryName}
        </li>
      )}
    </ul>
  );
};

export default PrevisionsSelect;
