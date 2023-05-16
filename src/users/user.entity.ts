import { UUID } from 'crypto';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  uuid: UUID;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;
}
