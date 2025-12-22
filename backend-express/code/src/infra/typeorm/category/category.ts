import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'int' })
  lft!: number;

  @Column({ type: 'int' })
  rght!: number;
}
