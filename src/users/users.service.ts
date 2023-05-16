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
    private userRepository: Repository<User>,
  ) {}

  findOneById(uuid: UUID): Promise<User | null> {
    return this.userRepository.findOneBy({ uuid });
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  signup(body: CreateUserDto): Promise<User> {
    const createdUser = this.userRepository.create(body);
    const savedUser = this.userRepository.save(createdUser);

    return savedUser;
  }

  deleteOneById(id: UUID): Promise<DeleteResult> {
    if (!this.findOneById(id)) {
      throw new NotFoundException('No se encontró el usuario');
    }

    const deleteResult = this.userRepository.delete(id);

    return deleteResult;
  }
}
