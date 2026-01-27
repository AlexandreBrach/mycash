import { Extrait } from '../../infra/typeorm/extrait/extrait';

export const ExtraitAssembler = (e: Extrait | Extrait[]): any => {
  if (Array.isArray(e)) {
    return e.map(ExtraitAssembler);
  }

  const { categorie, categorie_id, ...wanted } = e;

  return {
    ...wanted,
    categorie: categorie_id?.toString(),
    categorie_name: categorie?.name,
  };
};
