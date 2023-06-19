import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  findById(id: UUID): Promise<User> {
    if (!id) {
      return null;
    }

    return this.repo.findOneBy({ id });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOneBy({ email });
  }

  create(body: CreateUserDto): Promise<User> {
    const createdUser = this.repo.create(body);

    return this.repo.save(createdUser);
  }

  async update(id: UUID, attrs: Partial<User>) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('No se encontró el usuario.');
    }

    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  deleteOneById(id: UUID): Promise<DeleteResult> {
    if (!this.findById(id)) {
      throw new NotFoundException('No se encontró el usuario');
    }

    const deleteResult = this.repo.delete(id);

    return deleteResult;
  }
}
