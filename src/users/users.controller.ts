import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthGuard } from '../guards/auth.guard';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';

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
    return await this.usersService.create(body);
  }

  @Patch('/update')
  async updateUser(
    @Query('id') id: UUID,
    @Body() body: Partial<CreateUserDto>,
  ): Promise<User> {
    return await this.usersService.update(id, body);
  }

  @Delete('/delete')
  deleteUser(@Query('id') id: UUID): UUID {
    return this.usersService.delete(id);
  }
}
