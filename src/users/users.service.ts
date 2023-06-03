import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './DTOs/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  findOneById(uuid: UUID): Promise<User | null> {
    return this.repo.findOneBy({ uuid });
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.repo.findOneBy({ email });
  }

  signup(body: CreateUserDto): Promise<User> {
    const createdUser = this.repo.create(body);
    const savedUser = this.repo.save(createdUser);

    return savedUser;
  }

  async update(id: UUID, attrs: Partial<User>) {
    const user = await this.findOneById(id);

    if (!user) {
      throw new NotFoundException('No se encontró el usuario.');
    }

    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  deleteOneById(id: UUID): Promise<DeleteResult> {
    if (!this.findOneById(id)) {
      throw new NotFoundException('No se encontró el usuario');
    }

    const deleteResult = this.repo.delete(id);

    return deleteResult;
  }
}
