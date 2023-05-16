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
import { DeleteResult } from 'typeorm';
import { CreateUserDto } from './DTOs/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/auth/find')
  async findOneById(@Query('id') uuid: UUID): Promise<User> {
    const user = await this.usersService.findOneById(uuid);

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
