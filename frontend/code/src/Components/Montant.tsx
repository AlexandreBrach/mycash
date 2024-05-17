import { FC } from 'react';
import factory from '../services/Factory';
import './Montant.scss';

interface Props {
  value: number | undefined;
  colored?: boolean;
  inverseColor?: boolean;
}

const Montant: FC<Props> = ({ value, colored = false, inverseColor = false }) => {
  const formatService = factory.getFormatService();
  const cl = colored && value ? ((inverseColor ? -1 : 1) * value < 0 ? 'alert' : 'ok') : '';

  return value && <span className={'montant ' + cl}>{formatService.renderMontant(value)}&nbsp;&euro;</span>;
};

export default Montant;
