import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Query,
  Session,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import { IResponse, IResponseData } from 'src/interfaces/responses';
import { CurrentUser } from './decorators/current-user.decorator';

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
  identify(@Session() session: any): Promise<User> {
    const user = this.usersService.findById(session.id);

    if (!user) {
      throw new NotFoundException('No existe una sesión activa.');
    }

    return user;
  }

  @Get('/auth/whoami')
  whoAmI(@CurrentUser() user: string): string {
    if (!user) {
      throw new NotFoundException('No existe una sesión activa.');
    }

    return user;
  }

  @Post('/auth/signout')
  signOut(@Session() session: any): void {
    session.id = null;
  }

  @Delete('/delete')
  async deleteOneById(@Query('id') id: UUID) {
    const queryResult = await this.usersService.deleteOneById(id);

    return queryResult.affected;
  }
}
