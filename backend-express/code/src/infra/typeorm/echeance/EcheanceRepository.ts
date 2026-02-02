import { Between } from 'typeorm';
import { DAOInterface, GenericRepository, GenericRepositoryInterface } from '../GenericRepository';
import { AppDataSource } from '../ormconfig';
import { EcheanceOrm } from './echeance';
import { Interval } from '../../../exportable/Interval/Interval';
import { Echeance } from '../../../models/Echeance';

const EcheanceOrmRepository = AppDataSource.getRepository(EcheanceOrm);

class EcheanceDAO implements DAOInterface<EcheanceOrm, Echeance> {
  public assemble(o: EcheanceOrm) {
    return new Echeance(o);
  }
}

export interface EcheanceRepositoryInterface extends GenericRepositoryInterface<Echeance, EcheanceOrm> {
  inInterval: (interval: Interval) => Promise<Echeance[]>;
  getEcheancierIds: () => Promise<{ id: number; category: number }[]>;
}

export const EcheanceRepository = (): EcheanceRepositoryInterface => {
  const tableName = 'comptes_echeance';
  const dao = new EcheanceDAO();

  return {
    ...GenericRepository<Echeance, EcheanceOrm>(EcheanceOrmRepository, dao),
    inInterval: async (interval: Interval) => {
      const ormObj = await EcheanceOrmRepository.find({
        where: {
          due_date: Between(interval.start, interval.end),
        },
      });

      return (await ormObj).map((e) => dao.assemble(e));
    },
    getEcheancierIds: async (): Promise<{ id: number; category: number }[]> => {
      const distinctCategories = await EcheanceOrmRepository.createQueryBuilder(tableName)
        .select(`DISTINCT ${tableName}.categorie_id,${tableName}.collection`)
        .getRawMany();
      return distinctCategories.map((result) => ({ id: result.collection, category: result.categorie_id }));
    },
  };
};
