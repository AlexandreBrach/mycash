import { FC } from 'react';
import Montant from './Montant';
import './MontantTable.scss';

interface Props {
  values: { label: string; value: number }[];
}

const MontantTable: FC<Props> = ({ values }) => (
  <table className="montants">
    <tbody>
      {values.map((v, i) => (
        <tr key={i}>
          <td>{v.label}&nbsp;:&nbsp;</td>
          <td>
            <Montant value={v.value} colored={true} />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default MontantTable;
