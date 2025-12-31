import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'comptes_synthese',
  expression: `SELECT * FROM comptes_synthese`,
})
export class Synthese {
  @ViewColumn()
  month!: number;

  @ViewColumn()
  year!: number;

  @ViewColumn()
  categorie_id!: number;

  @ViewColumn()
  categorie_name!: string;

  @ViewColumn()
  amount!: string;
}
