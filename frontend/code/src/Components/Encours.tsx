import { FC, useContext } from 'react';
import { Encours } from '../interfaces/extraits';
import { treeFindById } from '../exportable/Hierarchie/Tree';
import { AppContext } from '../Pages/AppContext';
import Montant from './Montant';

interface Props {
  encours: Encours;
  fact: number;
}

const EncoursWrapper: FC<Props> = ({ encours, fact }) => {
  const { state } = useContext(AppContext);

  const cat = treeFindById(state.availableCategories, encours.categoryId)!;
  const color = treeFindById(state.categoryColors, encours.categoryId)!.color;

  return (
    <div className="encours" style={{ borderColor: color }}>
      <span className="name" style={{ color }}>
        {cat.name}
      </span>
      <br />
      <p className="amount">
        {fact === 0 || (
          <>
            <Montant value={fact} colored={fact < encours.amount} inverseColor={encours.amount > 0} />
            &nbsp;/&nbsp;
          </>
        )}
        <Montant value={encours.amount} />
      </p>
    </div>
  );
};

export default EncoursWrapper;
