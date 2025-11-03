import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('comptes_previsionrules')
export class Rules {
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
}
