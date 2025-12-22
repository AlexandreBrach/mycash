import { CategoryRepositoryInterface } from '../../infra/typeorm/category/CategoryRepository';
import { Category } from '../../infra/typeorm/category/category';

export interface CreateCategoryDto {
  name: string;
  parentId?: number;
}

export interface UpdateCategoryDto {
  name: string;
}

export interface MoveCategoryDto {
  newParentId: number;
}

export interface CategoryServiceInterface {
  getAllCategories: () => Promise<Category[]>;
  getCategoryById: (id: number) => Promise<Category | null>;
  getCategoryTree: () => Promise<Category[]>;
  createCategory: (dto: CreateCategoryDto) => Promise<Category>;
  updateCategory: (id: number, dto: UpdateCategoryDto) => Promise<Category | null>;
  deleteCategory: (id: number) => Promise<void>;
  moveCategory: (id: number, dto: MoveCategoryDto) => Promise<void>;
}

export const CategoryService = (
  categoryRepository: CategoryRepositoryInterface,
): CategoryServiceInterface => {
  return {
    getAllCategories: async () => {
      return categoryRepository.getAll();
    },

    getCategoryById: async (id: number) => {
      return categoryRepository.getById(id);
    },

    getCategoryTree: async () => {
      return categoryRepository.getTree();
    },

    createCategory: async (dto: CreateCategoryDto) => {
      return categoryRepository.insert(dto.name, dto.parentId);
    },

    updateCategory: async (id: number, dto: UpdateCategoryDto) => {
      return categoryRepository.update(id, dto.name);
    },

    deleteCategory: async (id: number) => {
      return categoryRepository.deleteNode(id);
    },

    moveCategory: async (id: number, dto: MoveCategoryDto) => {
      return categoryRepository.moveNode(id, dto.newParentId);
    },
  };
};
