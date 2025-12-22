import { FindManyOptions } from 'typeorm';
import { AppDataSource } from '../ormconfig';
import { Prevision } from './prevision';

export const PrevisionOrmRepository = AppDataSource.getRepository(Prevision);
export type PrevisionFilter = FindManyOptions<Prevision>;
