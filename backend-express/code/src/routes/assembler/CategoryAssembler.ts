import { Category } from '../../infra/typeorm/category/category';

export const CategoryAssembler = (p: Category | Category[]): any => {
  if (Array.isArray(p)) {
    return p.map(CategoryAssembler);
  }
  const { id, parent_id, ...other } = p;
  return {
    id: id.toString(),
    ...other,
    // children: p.
  };
};
