import { FC, useContext } from 'react';
import './SyntheseGridTree.scss';
import SyntheseLine from './SyntheseLine';
import { AppContext } from '../Pages/AppContext';
import { FlatTree } from '../exportable/Hierarchie/Tree';

interface Props {
  thead?: boolean;
  apportsFacts: FlatTree<{ value: number }>;
  previsions: FlatTree<{ value: number }>;
  previsionsFacts: FlatTree<{ value: number }>;
  previsionDiffs: FlatTree<{ value: number }>;
  unexpectedFacts: FlatTree<{ value: number }>;
  handleMontantClic: (category: string, month: string) => void;
}

const SyntheseGridTree: FC<Props> = ({
  apportsFacts,
  previsions,
  previsionsFacts,
  previsionDiffs,
  unexpectedFacts,
  handleMontantClic,
}) => {
  const { state } = useContext(AppContext);

  return (
    <div className="table-container">
      <table className="datagrid">
        <tbody>
          <tr className="header">
            <th colSpan={4}>Apport</th>
          </tr>
          <tr>
            <th></th>
            <th>Montant</th>
            <th></th>
            <th></th>
          </tr>
          <SyntheseLine
            id="facts"
            categories={state.availableCategories}
            column1={apportsFacts}
            column2={[]}
            column3={[]}
            level={1}
          />

          <tr className="header">
            <th colSpan={4}>Prévision</th>
          </tr>
          <tr>
            <th></th>
            <th>Prévisions</th>
            <th>Montant</th>
            <th>Reste</th>
          </tr>
          <SyntheseLine
            id="prev"
            categories={state.availableCategories}
            column1={previsions}
            column2={previsionsFacts}
            column3={previsionDiffs}
            level={1}
          />

          <tr className="header">
            <th colSpan={4}>Hors prévision</th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th>A provisionner</th>
          </tr>
          <SyntheseLine
            id="unexpected"
            categories={state.availableCategories}
            column1={[]}
            column2={[]}
            column3={unexpectedFacts}
            level={1}
          />
        </tbody>
      </table>
    </div>
  );
};

export default SyntheseGridTree;
