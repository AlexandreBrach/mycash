import { Echeance } from '../../models/Echeance';

export const EcheanceAssembler = (p: Echeance | Echeance[]): any => {
  if (Array.isArray(p)) {
    return p.map(EcheanceAssembler);
  }
  const { id, categorie_id, due_date, ...other } = p.raw();
  return {
    ...other,
    categoryId: categorie_id.toString(),
    date: due_date,
  };
};
