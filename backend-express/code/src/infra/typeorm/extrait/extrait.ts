import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CategoryOrm } from '../category/category';

@Entity('comptes_extrait')
export class ExtraitOrm {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'timestamp', nullable: false })
  date!: Date;

  @Column({ type: 'decimal', precision: 9, scale: 2 })
  montant!: number;

  @ManyToOne(() => CategoryOrm, { nullable: true })
  @JoinColumn({ name: 'categorie_id' })
  categorie?: CategoryOrm;

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

  @Column({ type: 'varchar', length: 255, nullable: false })
  note!: string;

  @Column({ type: 'timestamp', nullable: true })
  categorie_month?: Date;
}
