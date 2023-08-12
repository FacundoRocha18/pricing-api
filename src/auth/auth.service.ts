import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private passwordService: PasswordService,
  ) {}

  async signup({ email, name, password }: CreateUserDto) {
    const hashedPassword = await this.passwordService.hash(password);

    const user = await this.usersService.create({
      email,
      name,
      password: hashedPassword,
    });

    return user;
  }

  async signin(email: string, password: string) {
    const user = await this.usersService.findUserByEmailNoValidation(email);

    if (!user) {
      throw new NotFoundException(
        'No existe un usuario registrado con ese email.',
      );
    }

    const result = await this.passwordService.compare(user.password, password);

    if (!result) {
      throw new BadRequestException('La contraseña ingresada es incorrecta.');
    }

    return user;
  }
}
