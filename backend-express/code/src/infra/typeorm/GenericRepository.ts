import { FindManyOptions, FindOptionsWhere, In, ObjectLiteral, Repository } from 'typeorm';

export interface CompteEntity extends ObjectLiteral {
  id: number;
}

export interface GenericRepositoryInterface<Entity extends CompteEntity> {
  getAll: () => Promise<Entity[]>;
  getById: (id: number) => Promise<Entity | null>;
  findOne: (filter: FindManyOptions<Entity>) => Promise<Entity | null>;
  find: (filter: FindManyOptions<Entity>) => Promise<Entity[]>;
  create: (data: Entity) => Promise<Entity>;
  update: (id: number, data: Partial<Entity>, create: boolean) => Promise<Entity>;
  delete: (id: number) => Promise<void>;
  bulkUpdateById: <K extends keyof Entity>(propertyName: K, value: Entity[K], ids: number[]) => Promise<void>;
}

export const GenericRepository = <Entity extends CompteEntity>(
  repository: Repository<Entity>,
): GenericRepositoryInterface<Entity> => {
  const getAll = () => repository.find();

  const findOne = (filter: FindManyOptions<Entity>) => repository.findOne(filter);

  const find = (filter: FindManyOptions<Entity>) => repository.find(filter);
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
      throw Error('Not found !');
    }

    Object.assign(entity, data);
    return repository.save(entity);
  };

  const remove = async (id: number) => {
    await repository.delete(id);
  };

  const bulkUpdateById = async <K extends keyof Entity>(propertyName: K, value: Entity[K], ids: number[]) => {
    const criteria: FindOptionsWhere<CompteEntity> = { id: In(ids) };
    const props: Partial<Entity> = {};
    props[propertyName] = value;
    await repository.update(criteria, props);
  };

  return {
    getAll,
    find,
    findOne,
    getById,
    create,
    update,
    delete: remove,
    bulkUpdateById,
  };
};
