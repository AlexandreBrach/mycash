import { Category } from '../../models/Category';

export const CategoryAssembler = (p: Category | Category[]): any => {
  if (Array.isArray(p)) {
    return p.map(CategoryAssembler);
  }
  const { id, ...other } = p.raw();
  return {
    id: id.toString(),
    ...other,
  };
};
