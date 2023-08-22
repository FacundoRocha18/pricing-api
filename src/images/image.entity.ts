import { UUID } from 'crypto';
import {
  AfterInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Report } from '../reports/report.entity';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column()
  filename: string;

  @Column()
  content: string;

  @ManyToOne(() => Report, (report) => report.images)
  report: Report;

  @AfterInsert()
  logInsert(): void {
    console.log('Uploaded image with id: ', this.id);
  }
}
