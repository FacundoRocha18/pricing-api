import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('/find')
  async findUser(@Query('id') id: UUID): Promise<User> {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException('No se encontró el usuario');
    }

    return user;
  }

  @Get('/find')
  async findOneByEmail(@Query('email') email: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('No se encontró el usuario');
    }

    return user;
  }

  @Post('/auth/signup')
  async signup(@Body() body: CreateUserDto): Promise<User> {
    const user = await this.authService.signup(body);

    return user;
  }

  @Post('/auth/signin')
  signin(@Body() { email, password }: Partial<CreateUserDto>): Promise<User> {
    return this.authService.signin(email, password);
  }

  @Delete('/auth/delete')
  async deleteOneById(@Query('id') id: UUID) {
    const queryResult = await this.usersService.deleteOneById(id);

    return queryResult.affected;
  }
}
