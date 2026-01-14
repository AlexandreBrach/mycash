import { Extrait } from '../../infra/typeorm/extrait/extrait';

export const ExtraitAssembler = (e: Extrait | Extrait[]): any => {
  if (Array.isArray(e)) {
    return e.map(ExtraitAssembler);
  }

  const { categorie, ...wanted } = e;

  return {
    ...wanted,
    categorie_name: categorie?.name,
  };
};
