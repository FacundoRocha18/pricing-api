import {
  Body,
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
import { AuthGuard } from '../guards/auth.guard';
import { FindOptionsWhere } from 'typeorm';

@Controller('users')
@UseGuards(AuthGuard)
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/find')
  async findUser(@Body() query: FindOptionsWhere<User>): Promise<User> {
    return await this.usersService.find(query)[0];
  }

  @Get('/list')
  async listUsers(): Promise<User[]> {
    return await this.usersService.find({});
  }

  @Delete('/delete')
  async deleteOneById(@Query('id') id: UUID): Promise<UUID> {
    return await this.usersService.delete(id);
  }
}
