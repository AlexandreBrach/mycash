export type EcheanceProperties = {
  // not mandatory : it can be an echeance ruled by a prevision
  id: number | null;
  due_date: Date;
  amount: number;
  collection: number | null;
  categorie_id: number;
};

export class Echeance {
  protected data: EcheanceProperties;
  constructor(props: EcheanceProperties) {
    this.data = props;
  }

  raw(): EcheanceProperties {
    return this.data;
  }
}
