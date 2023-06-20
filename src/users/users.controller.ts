import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from 'src/guards/auth.guard';

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

  @Get('/list')
  async listUsers(): Promise<User[]> {
    return await this.usersService.listUsers();
  }

  @UseGuards(AuthGuard)
  @Delete('/delete')
  async deleteOneById(@Query('id') id: UUID): Promise<number> {
    const queryResult = await this.usersService.deleteOneById(id);

    return queryResult.affected;
  }
}
