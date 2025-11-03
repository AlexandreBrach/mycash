import { FindManyOptions } from 'typeorm';
import { AppDataSource } from '../ormconfig';
import { Rules } from './rules';

export const RulesRepository = AppDataSource.getRepository(Rules);
export type RulesFilter = FindManyOptions<Rules>;
