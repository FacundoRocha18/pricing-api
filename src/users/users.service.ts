import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async findById(id: UUID): Promise<User> {
    const user = await this.repository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('No se encontró el usuario');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('No se encontró el usuario');
    }

    return user;
  }

  async listAll(options?: FindOptionsWhere<User>): Promise<User[]> {
    const users = await this.repository.find({ where: options });

    if (users.length === 0) {
      throw new NotFoundException('No se encontró el usuario');
    }

    return users;
  }

  create(body: CreateUserDto): Promise<User> {
    const createdUser = this.repository.create(body);

    return this.repository.save(createdUser);
  }

  async update(id: UUID, attrs: Partial<User>) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('No se encontró el usuario.');
    }

    Object.assign(user, attrs);

    return this.repository.save(user);
  }

  delete(id: UUID): UUID {
    if (!this.listAll({ id })) {
      throw new NotFoundException('No se encontró el usuario');
    }

    this.repository.delete(id);

    return id;
  }
}
