import { Between } from 'typeorm';
import { GenericRepository, GenericRepositoryInterface } from '../GenericRepository';
import { AppDataSource } from '../ormconfig';
import { Echeance } from './echeance';
import { Interval } from '../../../helpers/interval';

const EcheanceOrmRepository = AppDataSource.getRepository(Echeance);

export interface EcheanceRepositoryInterface extends GenericRepositoryInterface<Echeance> {
  inInterval: (interval: Interval) => Promise<Echeance[]>;
  getEcheancierIds: () => Promise<{ id: number; category: number }[]>;
}

export const EcheanceRepository = (): EcheanceRepositoryInterface => {
  const tableName = 'comptes_echeance';
  return {
    ...GenericRepository(EcheanceOrmRepository),
    inInterval: async (interval: Interval) => {
      return EcheanceOrmRepository.find({
        where: {
          due_date: Between(interval.start, interval.end),
        },
      });
    },
    getEcheancierIds: async (): Promise<{ id: number; category: number }[]> => {
      const distinctCategories = await EcheanceOrmRepository.createQueryBuilder(tableName)
        .select(`DISTINCT ${tableName}.categorie_id,${tableName}.collection`)
        .getRawMany();
      return distinctCategories.map((result) => ({ id: result.collection, category: result.categorie_id }));
    },
  };
};
