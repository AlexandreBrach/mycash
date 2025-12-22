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
  return {
    getAll: () => repository.find(),
    find: (filter: FindManyOptions<Entity>) => repository.findOne(filter),
    getById: async (id: number) => {
      return repository.findOneBy({ id } as FindOptionsWhere<Entity>);
    },
  };
};
