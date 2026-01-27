import { Extrait } from '../../infra/typeorm/extrait/extrait';
import { ExtraitRepositoryInterface } from '../../infra/typeorm/extrait/ExtraitRepository';
import { FindManyOptions, Raw } from 'typeorm';

export interface ExtraitServiceInterface {
  getDistinctMonths: () => Promise<string[]>;
  getExtraitsByCategoryAndMonth: (p: { categoryId?: number; month?: string }) => Promise<Extrait[]>;
  assignCategory: (categoryId: number, extraitsId: number[]) => Promise<void>;
  injectCsv: (csvContent: string) => Promise<number>;
}

export const ExtraitService = (extraitRepository: ExtraitRepositoryInterface): ExtraitServiceInterface => {
  const parseDateFR = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`);
  };

  const parseMontant = (debit: string, credit: string): number => {
    if (debit) {
      return parseFloat(debit.replace(',', '.'));
    }
    if (credit) {
      return parseFloat(credit.replace(',', '.'));
    }
    throw new Error('Pas de montant trouvé (debit ou credit)');
  };

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
    injectCsv: async (csvContent: string) => {
      const lines = csvContent.trim().split('\n');

      if (lines.length === 0) {
        throw new Error('Le fichier CSV est vide');
      }

      // Ignorer la ligne d'en-tête
      const dataLines = lines.slice(1);
      let insertedCount = 0;

      for (const line of dataLines) {
        if (!line.trim()) continue;

        const columns = line.split(';');

        if (columns.length < 13) {
          throw new Error(`Ligne invalide : ${line}`);
        }

        const dateComptabilisation = columns[0];
        const libelleSimplifie = columns[1];
        const libelleOperation = columns[2];
        const debit = columns[8];
        const credit = columns[9];
        const dateOperation = columns[10];

        try {
          const extrait: Omit<Extrait, 'id'> = {
            date: parseDateFR(dateComptabilisation),
            montant: parseMontant(debit, credit),
            label: libelleSimplifie || libelleOperation,
            date_insertion: new Date(),
            unicity_flag: 0,
            note: libelleOperation,
          };

          await extraitRepository.create(extrait);
          insertedCount++;
        } catch (error) {
          throw new Error(`Erreur lors de l'insertion de la ligne : ${line}. Erreur: ${error}`);
        }
      }

      return insertedCount;
    },
  };
};
