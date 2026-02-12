export interface ExtraitProperties {
  id: number;
  date: Date;
  montant: number;
  categoryId: number | undefined;
  label: string;
  unicityFlag: number;
  dateInsertion: Date;
  solde?: number;
  note: string;
  categoryMonth: Date | undefined;
}

export class Extrait {
  protected data: ExtraitProperties;
  constructor(props: ExtraitProperties) {
    this.data = props;
  }
  raw(): ExtraitProperties {
    return this.data;
  }
}
