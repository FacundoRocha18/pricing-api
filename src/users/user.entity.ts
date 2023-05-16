import { UUID } from 'crypto';
import { Entity, Column, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column('timestamptz', { default: 'now' })
  signupDate: Timestamp;
}
