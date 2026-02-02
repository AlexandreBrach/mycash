import { Prevision } from '../../models/Prevision';

export const PrevisionAssembler = (p: Prevision | Prevision[]): any => {
  if (Array.isArray(p)) {
    return p.map(PrevisionAssembler);
  }

  return {
    ...p,
    categoryId: p.categoryId.toString(),
  };
};
