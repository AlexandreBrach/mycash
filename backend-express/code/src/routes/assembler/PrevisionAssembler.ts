import { Prevision } from '../../infra/typeorm/prevision/prevision';

export const PrevisionAssembler = (p: Prevision | Prevision[]): any => {
  if (Array.isArray(p)) {
    return p.map(PrevisionAssembler);
  }
  const { due_date, ...other } = p;
  return {
    ...other,
    date: due_date,
  };
};
