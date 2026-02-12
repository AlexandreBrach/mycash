export type EcheanceProperties = {
  // not mandatory : it can be an echeance ruled by a prevision
  id: number;
  dueDate: Date;
  amount: number;
  collection: number | null;
  categoryId: number;
  override: boolean;
};

export class Echeance {
  protected data: EcheanceProperties;
  constructor(props: EcheanceProperties) {
    this.data = { ...props };
  }

  raw(): EcheanceProperties {
    return this.data;
  }
}
