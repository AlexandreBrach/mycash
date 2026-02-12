import { DeepPartial, FindManyOptions, FindOptionsWhere, In, ObjectLiteral, Repository } from 'typeorm';

export interface CompteEntity extends ObjectLiteral {
  id: number;
}

export interface DAOInterface<EntityOrm, EntityModel> {
  assemble(o: EntityOrm): EntityModel;
  unassemble(entity: EntityModel): EntityOrm;
}

export interface GenericRepositoryInterface<EntityModel, EntityOrm> {
  getAll: () => Promise<EntityModel[]>;
  getById: (id: number) => Promise<EntityModel | null>;
  findOne: (filter: FindManyOptions<EntityOrm>) => Promise<EntityModel | null>;
  find: (filter: FindManyOptions<EntityOrm>) => Promise<EntityModel[]>;
  create: (data: Omit<EntityOrm, 'id'>) => Promise<void>;
  update: (id: number, data: EntityModel) => Promise<EntityModel>;
  delete: (id: number) => Promise<void>;
  bulkUpdateById: <K extends keyof EntityOrm>(propertyName: K, value: EntityOrm[K], ids: number[]) => Promise<void>;
}

export const GenericRepository = <EntityModel, EntityOrm extends CompteEntity>(
  repository: Repository<EntityOrm>,
  dao: DAOInterface<EntityOrm, EntityModel>,
): GenericRepositoryInterface<EntityModel, EntityOrm> => {
  const getAll = async () => {
    const orm = await repository.find();
    return orm.map(dao.assemble);
  };

  const findOne = async (filter: FindManyOptions<EntityOrm>) => {
    const orm = await repository.findOne(filter);
    return orm && dao.assemble(orm);
  };

  const find = async (filter: FindManyOptions<EntityOrm>) => {
    const orm = await repository.find(filter);
    return orm.map(dao.assemble);
  };

  const getById = async (id: number) => {
    const orm = await repository.findOneBy({ id } as FindOptionsWhere<EntityOrm>);
    return orm && dao.assemble(orm);
  };

  const create = async (data: Omit<EntityOrm, 'id'>) => {
    const entity = repository.create(data as DeepPartial<EntityOrm>);
    await repository.save(entity);
  };

  const update = async (id: number, model: EntityModel) => {
    const existing = await repository.findOneBy({ id } as FindOptionsWhere<EntityOrm>);
    if (!existing) {
      throw Error('Not found !');
    }

    const entity = dao.unassemble(model);
    const orm = await repository.save(entity);
    return dao.assemble(orm);
  };

  const remove = async (id: number) => {
    await repository.delete(id);
  };

  const bulkUpdateById = async <K extends keyof EntityOrm>(propertyName: K, value: EntityOrm[K], ids: number[]) => {
    const criteria: FindOptionsWhere<CompteEntity> = { id: In(ids) };
    const props: Partial<EntityOrm> = {};
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
