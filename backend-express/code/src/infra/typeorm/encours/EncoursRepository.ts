import { FindManyOptions } from 'typeorm';
import { AppDataSource } from '../ormconfig';
import { Encours } from './encours';

export const EncoursOrmRepository = AppDataSource.getRepository(Encours);
export type EncoursFilter = FindManyOptions<Encours>;
