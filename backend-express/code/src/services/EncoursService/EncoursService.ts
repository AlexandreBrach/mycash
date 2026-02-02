import { EncoursRepositoryInterface } from '../../infra/typeorm/encours/EncoursRepository';
import { Encours } from '../../models/Encours';

export interface EncoursServiceInterface {
  getAll: () => Promise<Encours[]>;
}

export const EncoursService = (encoursRepository: EncoursRepositoryInterface): EncoursServiceInterface => {
  return {
    getAll: async () => {
      return encoursRepository.getAll();
    },
  };
};
