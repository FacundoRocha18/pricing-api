import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from '../users/dto/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { JWTService } from './jwt.service';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JWTService,
  ) {}

  @Post('/signup')
  async signUp(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authService.signup(body);

    session.id = user.id;

    return user;
  }

  @Post('/signin')
  async signIn(
    @Body() { email, password }: Partial<CreateUserDto>,
    @Session() session: any,
  ): Promise<string> {
    const user = await this.authService.signin(email, password);
    session.id = user.id;

    return this.jwtService.generateJWT(user);
  }

  @Get('/identify')
  identify(@CurrentUser() user: User): User {
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any): void {
    session.id = null;
  }
}
