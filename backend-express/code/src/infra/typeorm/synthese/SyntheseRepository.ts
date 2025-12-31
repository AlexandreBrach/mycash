import { AppDataSource } from '../ormconfig';
import { Synthese } from './synthese';

const SyntheseOrmRepository = AppDataSource.getRepository(Synthese);

export interface SyntheseRepositoryInterface {
  getAll: () => Promise<Synthese[]>;
}

export const SyntheseRepository = (): SyntheseRepositoryInterface => {
  return {
    getAll: async () => {
      return SyntheseOrmRepository.find();
    },
  };
};
