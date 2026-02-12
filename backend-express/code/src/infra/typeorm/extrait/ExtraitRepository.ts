import { FindManyOptions } from 'typeorm';
import { AppDataSource } from '../ormconfig';
import { ExtraitOrm } from './extrait';
import { DAOInterface, GenericRepository, GenericRepositoryInterface } from '../GenericRepository';
import { Extrait } from '../../../models/Extrait';

const ExtraitOrmRepository = AppDataSource.getRepository(ExtraitOrm);
export type ExtraitFilter = FindManyOptions<ExtraitOrm>;

export interface ExtraitRepositoryInterface extends GenericRepositoryInterface<Extrait, ExtraitOrm> {
  getDistinctMonths: () => Promise<string[]>;
}

class ExtraitDAO implements DAOInterface<ExtraitOrm, Extrait> {
  public assemble(o: ExtraitOrm) {
    const { categorie_id, unicity_flag, date_insertion, categorie_month, ...all } = o;

    return new Extrait({
      ...all,
      categoryId: categorie_id,
      unicityFlag: unicity_flag,
      dateInsertion: date_insertion,
      categoryMonth: categorie_month,
    });
  }
  public unassemble(entity: Extrait): ExtraitOrm {
    const { unicityFlag, dateInsertion, ...wanted } = entity.raw();
    return { ...wanted, unicity_flag: unicityFlag, date_insertion: dateInsertion };
  }
}

export const ExtraitRepository = (): ExtraitRepositoryInterface => {
  const dao = new ExtraitDAO();
  const generic = GenericRepository<Extrait, ExtraitOrm>(AppDataSource.getRepository(ExtraitOrm), dao);
  return {
    ...generic,

    getDistinctMonths: async () => {
      const results = await ExtraitOrmRepository.createQueryBuilder('extrait')
        .select("TO_CHAR(extrait.date, 'YYYY-MM')", 'month')
        .distinct(true)
        .orderBy('month', 'DESC')
        .getRawMany();

      return results.map((r) => r.month);
    },
  };
};
