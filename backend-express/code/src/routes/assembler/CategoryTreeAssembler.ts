import { CategoryTree } from '../../services/CategoryService/CategoryService';

export const CategoryTreeAssembler = (tree: CategoryTree): any => {
  return tree.map((c) => {
    const { id, parent_id, children, ...other } = c;
    return {
      id: id.toString(),
      ...other,
      children: CategoryTreeAssembler(children),
    };
  });
};
