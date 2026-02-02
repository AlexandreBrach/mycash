export interface EncoursProperties {
  id: number | undefined;
  amount: number;
  due_date: Date;
  closed: boolean;
  categoryId: number | undefined;
}

export class Encours {
  protected data: EncoursProperties;
  constructor(props: EncoursProperties) {
    this.data = props;
  }
  raw(): EncoursProperties {
    return this.data;
  }
}
