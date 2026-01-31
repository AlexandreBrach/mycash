import { FindOptionsWhere, Repository } from 'typeorm';
import { AppDataSource } from '../ormconfig';
import { Category } from './category';
import { GenericRepository, GenericRepositoryInterface } from '../GenericRepository';

const CategoryOrmRepository = AppDataSource.getRepository(Category);

export interface CategoryRepositoryInterface extends GenericRepositoryInterface<Category> {
  getAll: () => Promise<Category[]>;
  getById: (id: number) => Promise<Category | null>;
  getFlat: () => Promise<Category[]>;
  insert: (name: string, parentId?: number) => Promise<Category>;
  deleteNode: (id: number) => Promise<void>;
  moveNode: (nodeId: number, newParentId: number) => Promise<void>;
}

export const CategoryRepository = (ormRepo: Repository<Category>): CategoryRepositoryInterface => {
  const _insertAtRoot = async (name: string) => {
    // Insert as root / new tree
    const maxRght = await ormRepo.createQueryBuilder('c').select('MAX(c.rght)', 'max').getRawOne();
    const maxTreeId = await ormRepo.createQueryBuilder('c').select('MAX(c.tree_id)', 'max').getRawOne();

    const newLft = maxRght?.max ? maxRght.max + 1 : 1;
    const category = ormRepo.create({
      name,
      lft: newLft,
      rght: newLft + 1,
      level: 0,
      tree_id: maxTreeId ? maxTreeId.max + 1 : 1,
    });

    return ormRepo.save(category);
  };

  return {
    ...GenericRepository(CategoryOrmRepository),

    /**
     * update the category, only for properties that are not used for Preorder Tree Traversal
     *
     * @param id
     * @param data
     * @param create
     * @returns
     */
    update: async (id: number, data: Partial<Category>) => {
      const { lft, rght, tree_id, level, parent_id, ...authorized } = data;

      const entity = await ormRepo.findOneBy({ id } as FindOptionsWhere<Category>);
      if (!entity) {
        throw Error('Not found !');
      }

      Object.assign(entity, data);
      return ormRepo.save(entity);
    },

    getFlat: async () => {
      return await ormRepo.find({
        order: { lft: 'ASC' },
      });
    },

    insert: async (name: string, parentId?: number) => {
      if (parentId) {
        // Insert as child of parent
        const parent = await ormRepo.findOne({
          where: { id: parentId },
        });

        if (!parent) {
          throw new Error('Parent category not found');
        }

        // Update all nodes to the right
        await ormRepo
          .createQueryBuilder()
          .update(Category)
          .set({ rght: () => 'rght + 2' })
          .where('rght >= :parentRght', { parentRght: parent.rght })
          .execute();

        await ormRepo
          .createQueryBuilder()
          .update(Category)
          .set({ lft: () => 'lft + 2' })
          .where('lft > :parentRght', { parentRght: parent.rght })
          .execute();

        // Insert new node
        const category = ormRepo.create({
          name,
          lft: parent.rght,
          rght: parent.rght + 1,
        });

        return ormRepo.save(category);
      } else {
        return await _insertAtRoot(name);
      }
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
