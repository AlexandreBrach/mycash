import { GenericRepositoryInterface } from '../../infra/typeorm/GenericRepository';
import { Encours } from '../../infra/typeorm/encours/encours';

export interface EncoursServiceInterface {
  getAll: () => Promise<Encours[]>;
}

export const EncoursService = (
  encoursRepository: GenericRepositoryInterface<Encours>,
): EncoursServiceInterface => {
  return {
    getAll: async () => {
      return encoursRepository.getAll();
    },
  };
};
