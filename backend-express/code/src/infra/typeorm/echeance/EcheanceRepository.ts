import { Between } from 'typeorm';
import { GenericRepository, GenericRepositoryInterface } from '../GenericRepository';
import { AppDataSource } from '../ormconfig';
import { Echeance } from './echeance';
import { Interval } from '../../../helpers/interval';

const EcheanceOrmRepository = AppDataSource.getRepository(Echeance);

export interface EcheanceRepositoryInterface extends GenericRepositoryInterface<Echeance> {
  inInterval: (interval: Interval) => Promise<Echeance[]>;
}

export const EcheanceRepository = (): EcheanceRepositoryInterface => {
  return {
    ...GenericRepository(EcheanceOrmRepository),
    inInterval: (interval: Interval) => {
      return EcheanceOrmRepository.find({
        where: {
          due_date: Between(interval.start, interval.end),
        },
      });
    },
  };
};
