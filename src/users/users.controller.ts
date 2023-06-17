import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(SerializeInterceptor)
  @Get('/auth/find')
  async findUser(@Query('id') id: UUID): Promise<User> {
    const user = await this.usersService.findOneById(id);

    if (!user) {
      throw new NotFoundException('No se encontró el usuario');
    }

    return user;
  }

  @Get('/auth/find')
  async findOneByEmail(@Query('email') email: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('No se encontró el usuario');
    }

    return user;
  }

  @Post('/auth/signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersService.signup(createUserDto);

    return user;
  }

  @Delete('/auth/delete')
  async deleteOneById(@Query('id') id: UUID) {
    const queryResult = await this.usersService.deleteOneById(id);

    return queryResult.affected;
  }
}
