import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { PasswordService } from './password.service';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private passwordService: PasswordService,
  ) {}

  async signup(data: CreateUserDto): Promise<User> {
    return await this.usersService.create(data);
  }

  async signin(email: string, password: string): Promise<User> {
    const user = await this.usersService.findUserByEmailNoValidation(email);

    if (!user) {
      throw new NotFoundException(
        'No existe un usuario registrado con el email: ' + email,
      );
    }

    const result = await this.passwordService.compare(user.password, password);

    if (!result) {
      throw new UnauthorizedException('La contraseña ingresada es incorrecta.');
    }

    user.password = '';

    return user;
  }
}
