import './EcheancierForm.scss';
import { FC, useState } from 'react';
import factory from '../services/Factory';
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi';
import { Echeance } from '../interfaces/extraits';
import CategoryTreeSelect from './CategoryTreeSelect';
import MonthInput from './MonthInput';
import Montant from './Montant';

interface Props {
  echeancier: Echeance[];
  echeancierId: string | undefined;
  onChange: (value: Echeance[]) => void;
  validation: () => void;
  deleteAction: (id: string) => void;
}

const EcheancierForm: FC<Props> = ({ echeancier, echeancierId, onChange, validation, deleteAction }) => {
  const handleChangeMontant = (index: number, echeanche: Echeance, newValue: number) => {
    echeancier[index] = { ...echeanche, amount: newValue };
    onChange([...echeancier]);
  };

  const handleAddLine = () => {
    const last = echeancier.slice(-1)[0];
    echeancier.push({ ...last, date: monthService.getMonthAfter(last.date) });
    onChange([...echeancier]);
  };

  const handleDeleteLast = () => {
    echeancier.pop();
    onChange([...echeancier]);
  };

  const handleChangeStartMonthEcheancier = (value: string) => {
    setStartMonthEcheancier(value);
    onChange([{ date: value, amount: 0, categoryId: echeancierCategoryId }]);
  };

  const handleChangeCategoryId = (value: string | undefined) => {
    if (value) {
      onChange(echeancier.map((e) => ({ ...e, categoryId: value })));
    }
  };

  const now = new Date();

  const formatService = factory.getFormatService();
  const monthService = factory.getMonthService();

  const [startMonthEcheancier, setStartMonthEcheancier] = useState<string>(
    now.getFullYear() + '-' + (now.getMonth() + 1),
  );

  const echeancierCategoryId = !echeancier[0] ? '0' : echeancier[0].categoryId ? echeancier[0].categoryId : '0';

  return (
    <>
      <table>
        <tbody>
          <tr>
            <td>Catégorie :</td>
            <td>
              <CategoryTreeSelect value={echeancierCategoryId} onChange={handleChangeCategoryId} />
            </td>
          </tr>
          <tr>
            <td>Première échéance :</td>
            <td>
              <MonthInput value={startMonthEcheancier} onChange={handleChangeStartMonthEcheancier} />
            </td>
          </tr>
          <tr>
            <td>Total :</td>
            <td>
              <Montant
                value={echeancier.reduce((prev, curr) => {
                  return prev + curr.amount;
                }, 0)}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div id="echeancier-container" className="thin-scrollbar">
        <table>
          <tbody>
            {echeancier.map((e, index) => (
              <tr key={index}>
                <td>{formatService.renderMonthFromSimplified(e.date)} : </td>
                <td>
                  <input
                    type="number"
                    value={e.amount}
                    onChange={(event) => handleChangeMontant(index, e, parseFloat(event.target.value))}
                  ></input>
                  {index === echeancier.length - 1 && (
                    <div className="icon-button" onClick={handleDeleteLast} title="Supprimer cette ligne">
                      &nbsp;
                      <FiMinusCircle />
                    </div>
                  )}
                </td>
              </tr>
            ))}
            <tr>
              <td></td>
              <td>
                <div className="icon-button" onClick={handleAddLine} title="ajouter une ligne">
                  <FiPlusCircle />
                </div>
                &nbsp;Ajouter
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="buttons" style={{ paddingTop: '1em' }}>
        <button onClick={validation}>Valider</button>
        &nbsp;
        {echeancierId && (
          <button
            onClick={() => {
              deleteAction(echeancierId);
            }}
          >
            Supprimer
          </button>
        )}
      </div>
    </>
  );
};

export default EcheancierForm;
