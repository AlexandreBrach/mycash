import './PrevisionsForm.scss';
import { FC, useState } from 'react';
import { PrevisionRules } from '../../interfaces/extraits';
import CategoryTreeSelect from '../CategoryTreeSelect';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  value: PrevisionRules;
  validation: (value: PrevisionRules) => void;
  deleteAction: (value: PrevisionRules) => void;
}

const PrevisionsForm: FC<Props> = ({ value, validation, deleteAction }) => {
  const handleValidation = () => {
    validation(rule);
  };

  const handleDelete = () => {
    deleteAction(rule);
  };

  const [rule, setRule] = useState<PrevisionRules>(value);

  return (
    <table className="previsions-form">
      <tbody>
        <tr>
          <td className="label">Catégorie :</td>
          <td>
            <CategoryTreeSelect
              value={rule.categoryId}
              emptyOption={false}
              onChange={(id: string | undefined) => {
                id && setRule({ ...rule, categoryId: id });
              }}
            />
          </td>
        </tr>
        <tr>
          <td className="label">Périodicité :</td>
          <td>
            <input
              type="number"
              value={rule.period}
              onChange={(e) => {
                setRule({ ...rule, period: parseInt(e.target.value) });
              }}
            ></input>
          </td>
        </tr>
        <tr>
          <td className="label">Montant :</td>
          <td>
            <input
              type="number"
              step=".01"
              value={rule.amount}
              onChange={(e) => {
                setRule({ ...rule, amount: parseFloat(e.target.value) });
              }}
            ></input>
          </td>
        </tr>
        <tr>
          <td className="label">Début :</td>
          <td>
            <ReactDatePicker
              selected={rule.start}
              onChange={(date) =>
                setRule({
                  ...rule,
                  start: date!,
                })
              }
              dateFormat="MM/yyyy"
              showMonthYearPicker
              showFullMonthYearPicker
            />
          </td>
        </tr>
        <tr>
          <td className="label">Fin :</td>
          <td>
            <ReactDatePicker
              selected={rule.end}
              onChange={(date) =>
                setRule({
                  ...rule,
                  end: date === null ? undefined : date,
                })
              }
              dateFormat="MM/yyyy"
              showMonthYearPicker
              showFullMonthYearPicker
            />
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            <button onClick={handleValidation}>Valider</button>
            <button onClick={handleDelete}>Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default PrevisionsForm;
