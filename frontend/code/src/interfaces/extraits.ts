import { Month } from '../exportable/Interval/Month';

export interface ExtraitLine {
  id: string;
  date: Date;
  label: string;
  montant: number;
  categoryId: string;
  categoryMonth: Date | null;
  note: string;
}

export type ExtraitField = keyof ExtraitLine;

export interface Criteria {
  categoryId: string | undefined;
  month: Month | undefined;
}

export type TSynthese = Record<string, Record<string, number>>;

export interface PrevisionRules {
  id: number;
  categoryId: string;
  categoryName: string;
  period: number;
  amount: number;
  start: Month;
  end: Month | undefined;
}

export interface Echeance {
  date: Month;
  amount: number;
  categoryId: string;
}

export type BackendEcheance = Omit<Echeance, 'amount' | 'date'> & { amount: string; date: string };

export interface Echeancier<T = Echeance> {
  collection: string;
  echeancierCategoryId: string;
  echeancier: T[];
}

export interface Encours {
  categoryId: string;
  amount: number;
  date: Date;
}

export type BackendEncours = Omit<Encours, 'date' | 'amount'> & { date: string; amount: string };
