import { AppDataSource } from '../ormconfig';
import { Echeance } from './echeance';

export const EcheanceOrmRepository = AppDataSource.getRepository(Echeance);
