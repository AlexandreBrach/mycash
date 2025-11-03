import { FindManyOptions, ObjectLiteral, Repository } from 'typeorm';

export interface GenericRepositoryInterface<Entity extends ObjectLiteral> {
  getAll: () => Promise<Entity[]>;
  find: (filter: FindManyOptions<Entity>) => Promise<Entity | null>;
}

export const GenericRepository = <Entity extends ObjectLiteral>(repository: Repository<Entity>) => {
  return {
    getAll: () => repository.find(),
    find: (filter: FindManyOptions<Entity>) => repository.findOne(filter),
  };
};
