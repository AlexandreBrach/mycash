import { Extrait } from '../../infra/typeorm/extrait/extrait';
import { ExtraitRepositoryInterface } from '../../infra/typeorm/extrait/ExtraitRepository';
import { FindManyOptions, Raw } from 'typeorm';

export interface ExtraitServiceInterface {
  getDistinctMonths: () => Promise<string[]>;
  getExtraitsByCategoryAndMonth: (p: { categoryId?: number; month?: string }) => Promise<Extrait[]>;
  assignCategory: (categoryId: number, extraitsId: number[]) => Promise<void>;
}

export const ExtraitService = (extraitRepository: ExtraitRepositoryInterface): ExtraitServiceInterface => {
  return {
    getDistinctMonths: async () => {
      return extraitRepository.getDistinctMonths();
    },
    getExtraitsByCategoryAndMonth: async ({ categoryId, month }) => {
      const options: FindManyOptions<Extrait> = {
        where: {
          categorie_id: categoryId,
          date: Raw((alias) => `TO_CHAR(${alias}, 'YYYY-MM') = :month`, { month }),
        },
        relations: ['categorie'],
        order: { date: 'DESC' },
      };

      return extraitRepository.find(options);
    },
    assignCategory: async (categoryId: number, extraitsIds: number[]) => {
      await extraitRepository.bulkUpdateById('categorie_id', categoryId, extraitsIds);
    },
  };
};
