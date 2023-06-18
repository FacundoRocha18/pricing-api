import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { compareHashedPassword, hashPassword } from 'src/utils';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup({ email, name, password }: CreateUserDto) {
    const storedUser = await this.usersService.findByEmail(email);

    if (storedUser) {
      throw new BadRequestException('Ese email ya está registrado.');
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await this.usersService.create({
      email,
      name,
      password: hashedPassword,
    });

    return newUser;
  }

  async signin(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException(
        'No existe un usuario registrado con ese email.',
      );
    }

    const compareResult = await compareHashedPassword(user.password, password);

    if (!compareResult) {
      throw new BadRequestException('La contraseña es incorrecta');
    }

    return user;
  }
}
