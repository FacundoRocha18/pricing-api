import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @IsStrongPassword()
  password: string;
}
