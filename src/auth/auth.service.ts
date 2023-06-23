import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compareHashedPassword, hashPassword } from '../utils';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup({ email, name, password }: CreateUserDto) {
    const users = await this.usersService.listAll({ email });

    if (users.length > 0) {
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
    const [user] = await this.usersService.listAll({ email });

    if (!user) {
      throw new BadRequestException(
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
