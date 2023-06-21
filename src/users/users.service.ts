import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  find(findOptions: FindOptionsWhere<User>): Promise<User[]> {
    if (!findOptions) return Promise.resolve([]);

    return this.repo.find({ where: findOptions });
  }

  create(body: CreateUserDto): Promise<User> {
    const createdUser = this.repo.create(body);

    return this.repo.save(createdUser);
  }

  async update(id: UUID, attrs: Partial<User>) {
    const [user] = await this.find({ id });

    if (!user) {
      throw new NotFoundException('No se encontró el usuario.');
    }

    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  deleteOneById(id: UUID): Promise<DeleteResult> {
    if (!this.find({ id })) {
      throw new NotFoundException('No se encontró el usuario');
    }

    const deleteResult = this.repo.delete(id);

    return deleteResult;
  }
}
