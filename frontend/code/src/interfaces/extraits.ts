export interface ExtraitLine {
  id: string;
  date_operation: Date;
  label: string;
  montant: number;
  categorie: string;
  categorie_name: string;
  categorie_month: Date | null;
  note: string;
}

export type ExtraitField = keyof ExtraitLine;

export interface Criteria {
  categoryId: string | undefined;
  month: string | undefined;
}

export interface MonthData {
  label: string; // 'Octobre 2023'
  value: string; // '2023-10'
  timestamp: number;
}

export type TSynthese = Record<string, Record<string, number>>;

export interface PrevisionRules {
  id: number;
  categoryId: string;
  categoryName: string;
  period: number;
  amount: number;
  start: Date;
  end: Date | undefined;
}

export interface Echeance {
  date: string;
  amount: number;
  categoryId: string;
}

export type BackendEcheance = Omit<Echeance, 'amount'> & { amount: string };

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
