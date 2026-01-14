import { Prevision } from '../../infra/typeorm/prevision/prevision';

export const PrevisionAssembler = (p: Prevision | Prevision[]): any => {
  if (Array.isArray(p)) {
    return p.map(PrevisionAssembler);
  }
  const { id, categorie_id, due_date, ...other } = p;
  return {
    ...other,
    categoryId: categorie_id,
    date: due_date,
  };
};
