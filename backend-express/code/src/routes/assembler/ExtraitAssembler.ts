import { Extrait } from '../../models/Extrait';

export const ExtraitAssembler = (e: Extrait | Extrait[]): any => {
  if (Array.isArray(e)) {
    return e.map(ExtraitAssembler);
  }

  const data = e.raw();
  return {
    ...data,
    categoryId: data.categoryId?.toString(),
    categoryMonth: data.categoryMonth && data.categoryMonth.toISOString(),
  };
};
