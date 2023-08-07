import { UUID } from 'crypto';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  AfterInsert,
} from 'typeorm';
import { Report } from '../reports/report.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Created user with id: ', this.id);
  }
}
