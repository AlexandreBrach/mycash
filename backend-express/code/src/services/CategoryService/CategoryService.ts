import { CategoryRepositoryInterface } from '../../infra/typeorm/category/CategoryRepository';
import { Category } from '../../infra/typeorm/category/category';

export interface CreateCategoryDto {
  color?: string;
  name: string;
  parentId?: number;
}

export interface UpdateCategoryDto {
  color: string;
  name: string;
}

export interface CategoryServiceInterface {
  getAllCategories: () => Promise<Category[]>;
  getCategoryById: (id: number) => Promise<Category | null>;
  getCategoryTree: () => Promise<CategoryTree>;
  createCategory: (dto: CreateCategoryDto) => Promise<Category>;
  updateCategory: (id: number, dto: Partial<UpdateCategoryDto>) => Promise<Category | null>;
  deleteCategory: (id: number) => Promise<void>;
  moveCategory: (id: number, parentId: number) => Promise<void>;
}

export type CategoryTree = (Category & { children: CategoryTree })[];

export const assembleCategoryTree = (data: Category[]): CategoryTree => {
  // Build tree structure
  const categoryMap = new Map<number, Category & { children: (Category & { children: CategoryTree })[] }>();
  const roots: CategoryTree = [];

  // First pass: create map with children arrays
  data.forEach((cat) => {
    categoryMap.set(cat.id, { ...cat, children: [] });
  });

  // Second pass: build tree
  data.forEach((cat) => {
    const node = categoryMap.get(cat.id)!;
    if (cat.parent_id === null || cat.parent_id === undefined) {
      roots.push(node);
    } else {
      const parent = categoryMap.get(cat.parent_id);
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
      const flat = await categoryRepository.getFlat();
      return assembleCategoryTree(flat);
    },

    createCategory: async (dto: CreateCategoryDto) => {
      return categoryRepository.insert(dto.name, dto.parentId);
    },

    updateCategory: async (id: number, dto: Partial<UpdateCategoryDto>) => {
      return await categoryRepository.update(id, dto);
    },

    deleteCategory: async (id: number) => {
      return categoryRepository.deleteNode(id);
    },

    moveCategory: async (id: number, parentId: number) => {
      return categoryRepository.moveNode(id, parentId);
    },
  };
};
