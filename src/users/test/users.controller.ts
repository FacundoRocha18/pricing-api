import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { AuthService } from '../../auth/auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
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

  @Post('/auth/signup')
  async signUp(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authService.signup(body);
    session.id = user.id;

    return user;
  }

  @Post('/auth/signin')
  async signIn(
    @Body() { email, password }: Partial<CreateUserDto>,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authService.signin(email, password);
    session.id = user.id;

    return user;
  }

  @Get('/auth/identify')
  identify(@CurrentUser() user: User): User {
    return user;
  }

  @Post('/auth/signout')
  signOut(@Session() session: any): void {
    session.id = null;
  }

  @UseGuards(AuthGuard)
  @Delete('/delete')
  async deleteOneById(@Query('id') id: UUID): Promise<number> {
    const queryResult = await this.usersService.deleteOneById(id);

    return queryResult.affected;
  }
}
