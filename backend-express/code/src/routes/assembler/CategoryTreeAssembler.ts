import { CategoryTree } from '../../services/CategoryService/CategoryService';

export const CategoryTreeAssembler = (tree: CategoryTree): any => {
  return tree.map((c) => {
    const { category, children } = c;
    const { id, parentId, ...other } = category.raw();
    return {
      id: id.toString(),
      ...other,
      children: CategoryTreeAssembler(children),
    };
  });
};
