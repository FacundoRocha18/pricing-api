import { UUID } from 'crypto';
import {
  AfterInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Image } from '../images/image.entity';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
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

  @Column({ default: false })
  approved: boolean;

  @ManyToOne(() => User, (user) => user.reports)
  user: User;

  @OneToMany(() => Image, (image) => image.report)
  images: Image[];

  @AfterInsert()
  logInsert(): void {
    console.log('Created report with id: ', this.id);
  }
}
