import { FindManyOptions, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';

export interface CompteEntity extends ObjectLiteral {
  id: number;
}

export interface GenericRepositoryInterface<Entity extends CompteEntity> {
  getAll: () => Promise<Entity[]>;
  getById: (id: number) => Promise<Entity | null>;
  find: (filter: FindManyOptions<Entity>) => Promise<Entity | null>;
}

export const GenericRepository = <Entity extends CompteEntity>(repository: Repository<Entity>) => {
  const getAll = () => repository.find();

  const find = (filter: FindManyOptions<Entity>) => repository.findOne(filter);
  const getById = async (id: number) => {
    return repository.findOneBy({ id } as FindOptionsWhere<Entity>);
  };
  const create = async (data: Entity) => {
    const entity = repository.create(data);
    return repository.save(entity);
  };

  const update = async (id: number, data: Partial<Entity>, create: boolean = true) => {
    const entity = await repository.findOneBy({ id } as FindOptionsWhere<Entity>);
    if (!entity) {
      return null;
    }

    Object.assign(entity, data);
    return repository.save(entity);
  };

  const remove = async (id: number) => {
    await repository.delete(id);
  };

  return {
    getAll,
    find,
    getById,
    create,
    update,
    delete: remove,
  };
};
