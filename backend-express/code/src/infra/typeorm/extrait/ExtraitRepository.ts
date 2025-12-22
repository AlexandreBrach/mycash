import { FindManyOptions } from 'typeorm';
import { AppDataSource } from '../ormconfig';
import { Extrait } from './extrait';

const ExtraitOrmRepository = AppDataSource.getRepository(Extrait);
export type ExtraitFilter = FindManyOptions<Extrait>;

export interface ExtraitRepositoryInterface {
  getAll: () => Promise<Extrait[]>;
  getById: (id: number) => Promise<Extrait | null>;
  filter: (criteria: ExtraitFilter) => Promise<Extrait[]>;
  create: (data: Partial<Extrait>) => Promise<Extrait>;
  update: (id: number, data: Partial<Extrait>) => Promise<Extrait | null>;
  delete: (id: number) => Promise<void>;
  getDistinctMonths: () => Promise<string[]>;
}

export const ExtraitRepository = (): ExtraitRepositoryInterface => {
  return {
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

    filter: async (criteria: ExtraitFilter) => {
      return ExtraitOrmRepository.find({
        ...criteria,
        relations: ['categorie'],
        order: { date: 'DESC', ...criteria.order },
      });
    },

    create: async (data: Partial<Extrait>) => {
      const extrait = ExtraitOrmRepository.create(data);
      return ExtraitOrmRepository.save(extrait);
    },

    update: async (id: number, data: Partial<Extrait>) => {
      const extrait = await ExtraitOrmRepository.findOne({
        where: { id },
      });

      if (!extrait) {
        return null;
      }

      Object.assign(extrait, data);
      return ExtraitOrmRepository.save(extrait);
    },

    delete: async (id: number) => {
      await ExtraitOrmRepository.delete(id);
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
