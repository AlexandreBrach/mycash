import { FindManyOptions } from 'typeorm';
import { AppDataSource } from '../ormconfig';
import { Extrait } from './extrait';
import { GenericRepository, GenericRepositoryInterface } from '../GenericRepository';

const ExtraitOrmRepository = AppDataSource.getRepository(Extrait);
export type ExtraitFilter = FindManyOptions<Extrait>;

export interface ExtraitRepositoryInterface extends GenericRepositoryInterface<Extrait> {
  getDistinctMonths: () => Promise<string[]>;
}

export const ExtraitRepository = (): ExtraitRepositoryInterface => {
  return {
    ...GenericRepository(ExtraitOrmRepository),
    getAll: async () => {
      return ExtraitOrmRepository.find({
        relations: ['categorie'],
        order: { date: 'DESC' },
      });
    },

    getById: async (id: number) => {
      return ExtraitOrmRepository.findOne({
        where: { id },
        relations: ['categorie'],
      });
    },

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
