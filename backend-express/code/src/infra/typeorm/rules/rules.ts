import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CategoryOrm } from '../category/category';

@Entity('comptes_previsionrules')
export class RuleOrm {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  period!: number;

  @Column()
  amount!: number;

  @Column({ nullable: true })
  end!: Date;

  @Column({ nullable: true })
  start!: Date;

  @ManyToOne(() => CategoryOrm, { nullable: true })
  @JoinColumn({ name: 'categorie_id' })
  categorie!: CategoryOrm;

  @Column({ type: 'int', nullable: true })
  categorie_id!: number;
}
