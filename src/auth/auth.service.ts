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

  async signup(data: CreateUserDto) {
    return await this.usersService.create(data);
  }

  async signin(email: string, password: string) {
    const user = await this.usersService.findUserByEmailNoValidation(email);

    if (!user) {
      throw new NotFoundException(
        'No existe un usuario registrado con el email: ' + email,
      );
    }

    const result = await this.passwordService.compare(user.password, password);

    if (!result) {
      throw new BadRequestException('La contraseña ingresada es incorrecta.');
    }

    return user;
  }
}
