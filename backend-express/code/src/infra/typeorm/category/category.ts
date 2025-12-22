import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('comptes_categorie')
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'varchar', length: 6, nullable: true })
  color?: string;

  @Column({ type: 'int' })
  lft!: number;

  @Column({ type: 'int' })
  rght!: number;

  @Column({ type: 'int' })
  tree_id!: number;

  @Column({ type: 'int' })
  level!: number;

  @Column({ type: 'int', nullable: true })
  parent_id?: number;
}
