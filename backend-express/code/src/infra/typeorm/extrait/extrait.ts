import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../category/category';

@Entity('comptes_extrait')
export class Extrait {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'timestamp', nullable: false })
  date!: Date;

  @Column({ type: 'decimal', precision: 9, scale: 2 })
  montant!: number;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'categorie_id' })
  categorie?: Category;

  @Column({ type: 'int', nullable: true })
  categorie_id?: number;

  @Column({ type: 'varchar', length: 200 })
  label!: string;

  @Column({ type: 'int', default: 0 })
  unicity_flag!: number;

  @Column({ type: 'timestamp', nullable: false })
  date_insertion!: Date;

  @Column({ type: 'decimal', precision: 9, scale: 2, nullable: true })
  solde?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  note?: string;

  @Column({ type: 'date', nullable: true })
  categorie_month?: Date;
}
