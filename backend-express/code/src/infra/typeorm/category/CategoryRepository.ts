import { AppDataSource } from '../ormconfig';
import { Category } from './category';

export const CategoryRepository = AppDataSource.getRepository(Category);

export interface CategoryRepositoryInterface {
  getAll: () => Promise<Category[]>;
  getById: (id: number) => Promise<Category | null>;
  getTree: () => Promise<Category[]>;
  insert: (name: string, parentId?: number) => Promise<Category>;
  update: (id: number, name: string) => Promise<Category | null>;
  deleteNode: (id: number) => Promise<void>;
  moveNode: (nodeId: number, newParentId: number) => Promise<void>;
}

export const CategoryRepositoryImpl = (): CategoryRepositoryInterface => {
  return {
    getAll: async () => {
      return CategoryRepository.find({
        order: { lft: 'ASC' },
      });
    },

    getById: async (id: number) => {
      return CategoryRepository.findOne({
        where: { id },
      });
    },

    getTree: async () => {
      const categories = await CategoryRepository.find({
        order: { lft: 'ASC' },
      });

      // Build tree structure
      const categoryMap = new Map<number, Category & { children: (Category & { children: any[] })[] }>();
      const roots: (Category & { children: any[] })[] = [];

      // First pass: create map with children arrays
      categories.forEach((cat) => {
        categoryMap.set(cat.id, { ...cat, children: [] });
      });

      // Second pass: build tree
      categories.forEach((cat) => {
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

      return roots as any;
    },

    insert: async (name: string, parentId?: number) => {
      return AppDataSource.transaction(async (manager) => {
        if (parentId) {
          // Insert as child of parent
          const parent = await manager.findOne(Category, {
            where: { id: parentId },
          });

          if (!parent) {
            throw new Error('Parent category not found');
          }

          // Update all nodes to the right
          await manager
            .createQueryBuilder()
            .update(Category)
            .set({ rght: () => 'rght + 2' })
            .where('rght >= :parentRght', { parentRght: parent.rght })
            .execute();

          await manager
            .createQueryBuilder()
            .update(Category)
            .set({ lft: () => 'lft + 2' })
            .where('lft > :parentRght', { parentRght: parent.rght })
            .execute();

          // Insert new node
          const category = manager.create(Category, {
            name,
            lft: parent.rght,
            rght: parent.rght + 1,
          });

          return manager.save(category);
        } else {
          // Insert as root (or new tree)
          const maxRght = await manager.createQueryBuilder(Category, 'c').select('MAX(c.rght)', 'max').getRawOne();

          const newLft = maxRght?.max ? maxRght.max + 1 : 1;
          const category = manager.create(Category, {
            name,
            lft: newLft,
            rght: newLft + 1,
          });

          return manager.save(category);
        }
      });
    },

    update: async (id: number, name: string) => {
      const category = await CategoryRepository.findOne({
        where: { id },
      });

      if (!category) {
        return null;
      }

      category.name = name;
      return CategoryRepository.save(category);
    },

    deleteNode: async (id: number) => {
      await AppDataSource.transaction(async (manager) => {
        const node = await manager.findOne(Category, {
          where: { id },
        });

        if (!node) {
          throw new Error('Category not found');
        }

        const width = node.rght - node.lft + 1;

        // Delete the node and its descendants
        await manager
          .createQueryBuilder()
          .delete()
          .from(Category)
          .where('lft >= :lft AND rght <= :rght', {
            lft: node.lft,
            rght: node.rght,
          })
          .execute();

        // Update remaining nodes
        await manager
          .createQueryBuilder()
          .update(Category)
          .set({ lft: () => `lft - ${width}` })
          .where('lft > :rght', { rght: node.rght })
          .execute();

        await manager
          .createQueryBuilder()
          .update(Category)
          .set({ rght: () => `rght - ${width}` })
          .where('rght > :rght', { rght: node.rght })
          .execute();
      });
    },

    moveNode: async (nodeId: number, newParentId: number) => {
      await AppDataSource.transaction(async (manager) => {
        const node = await manager.findOne(Category, {
          where: { id: nodeId },
        });

        const newParent = await manager.findOne(Category, {
          where: { id: newParentId },
        });

        if (!node || !newParent) {
          throw new Error('Node or parent not found');
        }

        // Check if trying to move node into its own subtree
        if (newParent.lft >= node.lft && newParent.rght <= node.rght) {
          throw new Error('Cannot move node into its own subtree');
        }

        const nodeWidth = node.rght - node.lft + 1;

        // This is a simplified version - full implementation would be more complex
        throw new Error('Move operation not yet fully implemented');
      });
    },
  };
};
