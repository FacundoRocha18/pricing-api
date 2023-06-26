import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { FindOptionsWhere } from 'typeorm';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthGuard } from '../guards/auth.guard';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { hashPassword } from '../utils';

@Controller('users')
@UseGuards(AuthGuard)
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/find')
  async findUserById(@Query('id') id: UUID): Promise<User> {
    return await this.usersService.findById(id);
  }

  @Get('/find')
  async findUserByEmail(@Query('email') email: string): Promise<User> {
    return await this.usersService.findByEmail(email);
  }

  @Get('/list')
  async listUsers(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Post('/create')
  async createUser(@Body() body: CreateUserDto): Promise<User> {
    const hashedPassword = await hashPassword(body.password);

    return await this.usersService.create({
      ...body,
      password: hashedPassword,
    });
  }

  @Delete('/delete')
  deleteUser(@Query('id') id: UUID): UUID {
    return this.usersService.delete(id);
  }
}
