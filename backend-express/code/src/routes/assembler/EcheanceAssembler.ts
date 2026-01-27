import { Echeance } from '../../infra/typeorm/echeance/echeance';

export const EchecanceAssembler = (p: Echeance | Echeance[]): any => {
  if (Array.isArray(p)) {
    return p.map(EchecanceAssembler);
  }
  const { id, categorie_id, due_date, ...other } = p;
  return {
    ...other,
    categoryId: categorie_id.toString(),
    date: due_date,
  };
};
