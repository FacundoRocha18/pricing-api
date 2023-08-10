import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compareHashedPassword, hashPassword } from '../utils';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup({ email, name, password }: CreateUserDto) {
    const hashedPassword = await hashPassword(password);

    const user = await this.usersService.create({
      email,
      name,
      password: hashedPassword,
    });

    return user;
  }

  async signin(email: string, password: string) {
    const user = await this.usersService.findUserByEmailWithoutValidation(
      email,
    );

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
