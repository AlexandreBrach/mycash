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

    insert: async (name: string) => {
      return await _insertAtRoot(name);
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
        // 1. Récupérer et valider les nœuds
        const node = await manager.findOne(Category, {
          where: { id: nodeId },
        });
        const newParent = await manager.findOne(Category, {
          where: { id: newParentId },
        });

        if (!node) {
          throw new Error('Node not found');
        }
        if (!newParent) {
          throw new Error('Parent not found');
        }

        // 2. Calculer les variables
        const nodeWidth = node.rght - node.lft + 1;
        const newPosition = newParent.rght;
        const levelDiff = newParent.level + 1 - node.level;
        const sourceTreeId = node.tree_id;
        const destTreeId = newParent.tree_id;

        if (sourceTreeId === destTreeId) {
          // CAS 1: Déplacement dans le même arbre

          // Validation: empêcher le déplacement dans son propre sous-arbre
          if (newParent.lft >= node.lft && newParent.rght <= node.rght) {
            throw new Error('Cannot move node into its own subtree');
          }

          const movingRight = newPosition > node.rght;

          // 3. Créer l'espace à la destination
          await manager
            .createQueryBuilder()
            .update(Category)
            .set({ lft: () => `lft + ${nodeWidth}` })
            .where('lft >= :newPosition', { newPosition })
            .andWhere('tree_id = :treeId', { treeId: sourceTreeId })
            .execute();

          await manager
            .createQueryBuilder()
            .update(Category)
            .set({ rght: () => `rght + ${nodeWidth}` })
            .where('rght >= :newPosition', { newPosition })
            .andWhere('tree_id = :treeId', { treeId: sourceTreeId })
            .execute();

          // 4. Déplacer le sous-arbre
          let currentLeft = node.lft;
          let currentRight = node.rght;

          if (!movingRight) {
            // Le nœud a été décalé lors de la création d'espace
            currentLeft += nodeWidth;
            currentRight += nodeWidth;
          }

          const distance = newPosition - currentLeft;

          await manager
            .createQueryBuilder()
            .update(Category)
            .set({
              lft: () => `lft + ${distance}`,
              rght: () => `rght + ${distance}`,
              level: () => `level + ${levelDiff}`,
            })
            .where('lft >= :currentLeft', { currentLeft })
            .andWhere('rght <= :currentRight', { currentRight })
            .andWhere('tree_id = :treeId', { treeId: sourceTreeId })
            .execute();

          // 5. Combler le trou à l'ancienne position
          await manager
            .createQueryBuilder()
            .update(Category)
            .set({ lft: () => `lft - ${nodeWidth}` })
            .where('lft > :currentRight', { currentRight })
            .andWhere('tree_id = :treeId', { treeId: sourceTreeId })
            .execute();

          await manager
            .createQueryBuilder()
            .update(Category)
            .set({ rght: () => `rght - ${nodeWidth}` })
            .where('rght > :currentRight', { currentRight })
            .andWhere('tree_id = :treeId', { treeId: sourceTreeId })
            .execute();
        } else {
          // CAS 2: Déplacement inter-arbres

          // 3. Marquer le sous-arbre avec valeurs négatives temporaires
          await manager
            .createQueryBuilder()
            .update(Category)
            .set({
              lft: () => '-lft',
              rght: () => '-rght',
            })
            .where('lft >= :lft', { lft: node.lft })
            .andWhere('rght <= :rght', { rght: node.rght })
            .andWhere('tree_id = :sourceTreeId', { sourceTreeId })
            .execute();

          // 4. Combler le trou dans l'arbre source
          await manager
            .createQueryBuilder()
            .update(Category)
            .set({ lft: () => `lft - ${nodeWidth}` })
            .where('lft > :rght', { rght: node.rght })
            .andWhere('tree_id = :sourceTreeId', { sourceTreeId })
            .execute();

          await manager
            .createQueryBuilder()
            .update(Category)
            .set({ rght: () => `rght - ${nodeWidth}` })
            .where('rght > :rght', { rght: node.rght })
            .andWhere('tree_id = :sourceTreeId', { sourceTreeId })
            .execute();

          // 5. Créer l'espace dans l'arbre destination
          await manager
            .createQueryBuilder()
            .update(Category)
            .set({ lft: () => `lft + ${nodeWidth}` })
            .where('lft >= :newPosition', { newPosition })
            .andWhere('tree_id = :destTreeId', { destTreeId })
            .execute();

          await manager
            .createQueryBuilder()
            .update(Category)
            .set({ rght: () => `rght + ${nodeWidth}` })
            .where('rght >= :newPosition', { newPosition })
            .andWhere('tree_id = :destTreeId', { destTreeId })
            .execute();

          // 6. Insérer le sous-arbre dans l'arbre destination
          await manager
            .createQueryBuilder()
            .update(Category)
            .set({
              lft: () => `ABS(lft) - ${node.lft} + ${newPosition}`,
              rght: () => `ABS(rght) - ${node.lft} + ${newPosition}`,
              level: () => `level + ${levelDiff}`,
              tree_id: destTreeId,
            })
            .where('lft < 0')
            .execute();
        }

        // 7. Mettre à jour le parent_id
        await manager
          .createQueryBuilder()
          .update(Category)
          .set({ parent_id: newParentId })
          .where('id = :nodeId', { nodeId })
          .execute();
      });
    },
  };
};
