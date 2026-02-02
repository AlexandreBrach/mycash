import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CategoryOrm } from '../category/category';

@Entity('comptes_echeance')
export class EcheanceOrm {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'date', nullable: false })
  due_date!: Date;

  @Column({ type: 'decimal', precision: 9, scale: 2, nullable: false })
  amount!: number;

  @Column({ type: 'boolean', default: false })
  override!: boolean;

  @Column({ type: 'int', nullable: true })
  collection!: number | null;

  @ManyToOne(() => CategoryOrm, { nullable: true })
  @JoinColumn({ name: 'categorie_id' })
  categorie!: CategoryOrm;

  @Column({ type: 'int', nullable: true })
  categorie_id!: number;
}
