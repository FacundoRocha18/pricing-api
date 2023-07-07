import { UUID } from 'crypto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn()
  id: UUID;

  @Column({ type: 'text' })
  maker: string;

  @Column({ type: 'text' })
  model: string;

  @Column()
  year: number;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @Column()
  kilometers: number;

  @Column()
  price: number;
}
