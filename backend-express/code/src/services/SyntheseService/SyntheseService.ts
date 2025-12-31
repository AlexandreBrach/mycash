import { GenericRepositoryInterface } from '../../infra/typeorm/GenericRepository';
import { Synthese } from '../../infra/typeorm/synthese/synthese';
import { SyntheseRepositoryInterface } from '../../infra/typeorm/synthese/SyntheseRepository';

export interface SyntheseServiceInterface {
  getSyntheseCategory: () => Promise<Record<string, Record<string, number>>>;
}

export const SyntheseService = (syntheseRepository: SyntheseRepositoryInterface): SyntheseServiceInterface => {
  const groupByMonth = (raw: Synthese[]): Record<string, Record<string, number>> => {
    const temp: Record<string, Record<string, number>> = {};
    const allCategories = new Set<string>();

    for (const r of raw) {
      const monthYear = `${r.year}-${r.month}`;
      if (!temp[monthYear]) {
        temp[monthYear] = {};
      }
      const categoryKey = r.categorie_id?.toString() || 'null';
      temp[monthYear][categoryKey] = parseFloat(r.amount);
      allCategories.add(categoryKey);
    }

    // Convert set to object with all categories set to 0
    const allCategoriesObj: Record<string, number> = {};
    allCategories.forEach((cat) => {
      allCategoriesObj[cat] = 0;
    });

    // Assemble response
    const response: Record<string, Record<string, number>> = {};
    for (const [monthYear, categories] of Object.entries(temp)) {
      response[monthYear] = { ...allCategoriesObj, ...categories };
    }

    return response;
  };

  return {
    getSyntheseCategory: async () => {
      const raw = await syntheseRepository.getAll();
      return groupByMonth(raw);
    },
  };
};
