import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../category/category';

@Entity('comptes_prev')
export class Prevision {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'date', nullable: false })
  due_date!: Date;

  @Column({ type: 'decimal', precision: 9, scale: 2, nullable: false })
  amount!: number;

  @ManyToOne(() => Category, { nullable: false })
  @JoinColumn({ name: 'categorie_id' })
  categorie!: Category;

  @Column({ type: 'int', nullable: false })
  categorie_id!: number;
}
