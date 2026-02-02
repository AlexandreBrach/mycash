import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { RuleOrm } from './rules/rules';
import { CategoryOrm } from './category/category';
import { ExtraitOrm } from './extrait/extrait';
import { EncoursOrm } from './encours/encours';
import { Synthese } from './synthese/synthese';
import { EcheanceOrm } from './echeance/echeance';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [RuleOrm, CategoryOrm, ExtraitOrm, EncoursOrm, Synthese, EcheanceOrm],
});
