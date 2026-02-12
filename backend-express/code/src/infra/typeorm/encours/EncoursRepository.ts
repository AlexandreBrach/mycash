import { FindManyOptions } from 'typeorm';
import { AppDataSource } from '../ormconfig';
import { EncoursOrm } from './encours';
import { DAOInterface, GenericRepository, GenericRepositoryInterface } from '../GenericRepository';
import { Encours } from '../../../models/Encours';

export type EncoursFilter = FindManyOptions<EncoursOrm>;

class EncoursDAO implements DAOInterface<EncoursOrm, Encours> {
  public assemble(o: EncoursOrm) {
    const { categorie_id, ...all } = o;
    return new Encours({ ...all, categoryId: categorie_id });
  }
  unassemble(entity: Encours): EncoursOrm {
    const { ...wanted } = entity.raw();

    return {
      ...wanted,
    };
  }
}

export interface EncoursRepositoryInterface extends GenericRepositoryInterface<Encours, EncoursOrm> {}

export const EncoursRepository = () => {
  const dao = new EncoursDAO();
  const generic = GenericRepository<Encours, EncoursOrm>(AppDataSource.getRepository(EncoursOrm), dao);
  return { ...generic };
};
