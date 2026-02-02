import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CategoryOrm } from '../category/category';

@Entity('comptes_encours')
export class EncoursOrm {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => CategoryOrm, { nullable: true })
  @JoinColumn({ name: 'categorie_id' })
  categorie?: CategoryOrm;

  @Column({ type: 'int', nullable: true })
  categorie_id?: number;

  @Column({ type: 'decimal', precision: 9, scale: 2 })
  amount!: number;

  @Column({ type: 'date', nullable: false })
  due_date!: Date;

  @Column({ type: 'boolean', default: false })
  closed!: boolean;
}
