import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../category/category';

@Entity('comptes_echeance')
export class Echeance {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'date', nullable: false })
  due_date!: Date;

  @Column({ type: 'decimal', precision: 9, scale: 2, nullable: false })
  amount!: string;

  @Column({ type: 'boolean', default: false })
  override!: boolean;

  @Column({ type: 'int', nullable: true })
  collection!: number | null;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'categorie_id' })
  categorie!: Category;

  @Column({ type: 'int', nullable: true })
  categorie_id!: number;
}
