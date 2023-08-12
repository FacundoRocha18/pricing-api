import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { hashPassword } from '../auth/password.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async findById(id: UUID): Promise<User> {
    const user = await this.repository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('No se encontró el usuario con id: ', id);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException(
        'No se encontró el usuario con email: ',
        email,
      );
    }

    return user;
  }

  async findUserByEmailNoValidation(email: string): Promise<User> {
    return await this.repository.findOneBy({ email });
  }

  async findAll(options?: FindOptionsWhere<User>): Promise<User[]> {
    const users = await this.repository.find({ where: options });

    if (users.length === 0) {
      throw new NotFoundException('No se encontraron usuarios');
    }

    return;
  }

  async create({ email, name, password }: CreateUserDto): Promise<User> {
    const storedUser = await this.findUserByEmailNoValidation(email);

    if (storedUser) {
      throw new BadRequestException('Ese email ya está registrado.');
    }

    const hashedPassword = await hashPassword(password);
    const user = this.repository.create({
      email,
      name,
      password: hashedPassword,
    });

    return this.repository.save(user);
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
    if (!this.findById(id)) {
      throw new NotFoundException('No se encontró el usuario');
    }

    this.repository.delete(id);

    return id;
  }
}
