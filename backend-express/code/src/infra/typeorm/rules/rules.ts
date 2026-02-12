import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CategoryOrm } from '../category/category';

@Entity('comptes_previsionrules')
export class RuleOrm {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  period!: number;

  @Column({ type: 'decimal', precision: 9, scale: 2 })
  amount!: number;

  @Column({ nullable: true })
  end?: Date;

  @Column({ nullable: false })
  start!: Date;

  @ManyToOne(() => CategoryOrm, { nullable: true })
  @JoinColumn({ name: 'categorie_id' })
  categorie?: CategoryOrm;

  @Column({ type: 'int', nullable: true })
  categorie_id!: number;
}
