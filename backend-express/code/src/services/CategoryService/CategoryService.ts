import { CategoryRepositoryInterface } from '../../infra/typeorm/category/CategoryRepository';
import { Category, CategoryProperties } from '../../models/Category';

export interface CategoryServiceInterface {
  getAllCategories: () => Promise<Category[]>;
  getCategoryById: (id: number) => Promise<Category | null>;
  getCategoryTree: () => Promise<CategoryTree>;
  createCategory: (name: string) => Promise<void>;
  updateProperty: (id: number, props: Partial<{ color: string; name: string }>) => Promise<Category | null>;
  deleteCategory: (id: number) => Promise<void>;
  moveCategory: (id: number, parentId: number) => Promise<void>;
}

export type CategoryTree = { category: Category; children: CategoryTree }[];

export const assembleCategoryTree = (data: Category[]): CategoryTree => {
  // Build tree structure
  const categoryMap = new Map<
    number,
    { category: Category; children: { category: Category; children: CategoryTree }[] }
  >();
  const roots: CategoryTree = [];

  // First pass: create map with children arrays
  data.forEach((cat) => {
    categoryMap.set(cat.raw().id, { category: cat, children: [] });
  });

  // Second pass: build tree
  data.forEach((cat) => {
    const p = cat.raw();
    const node = categoryMap.get(p.id)!;
    if (p.parentId === null || p.parentId === undefined) {
      roots.push(node);
    } else {
      const parent = categoryMap.get(p.parentId);
      if (parent) {
        parent.children.push(node);
      } else {
        // If parent not found, treat as root
        roots.push(node);
      }
    }
  });

  return roots;
};

export const CategoryService = (categoryRepository: CategoryRepositoryInterface): CategoryServiceInterface => {
  return {
    getAllCategories: async () => {
      return categoryRepository.getAll();
    },

    getCategoryById: async (id: number) => {
      return categoryRepository.getById(id);
    },

    getCategoryTree: async () => {
      const flat = await categoryRepository.getAll();
      return assembleCategoryTree(flat);
    },

    createCategory: async (name: string) => {
      return categoryRepository.simpleInsert(name);
    },

    updateProperty: async (id: number, props: Partial<{ color: string; name: string }>) => {
      const category = await categoryRepository.getById(id);
      if (!category) {
        throw 'No category Found';
      }
      const newProps = category.raw();
      if (props.color) {
        newProps.color = props.color;
      }
      if (props.name) {
        newProps.name = props.name;
      }
      return await categoryRepository.update(id, new Category(newProps));
    },

    deleteCategory: async (id: number) => {
      return categoryRepository.delete(id);
    },

    moveCategory: async (id: number, parentId: number) => {
      return categoryRepository.moveNode(id, parentId);
    },
  };
};
