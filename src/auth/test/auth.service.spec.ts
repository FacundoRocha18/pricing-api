import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { User } from 'src/users/user.entity';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersServiceMock: Partial<UsersService>;
  const userDataSample = {
    id: 'bf229f23-48f6-4dbc-b44d-2732f855ec7d',
    email: 'test@test.com',
    name: 'Test',
    password:
      '802d53df43c64b02.3cc5af59d428bbc8a5380bd85dc0d29bb2be990f4c0cdb0af1822bbbc65e45c3d17aa91ae7f548731fd3b3b9612b1d5725913873ba35f8f84022f414f9ad6229',
  };

  beforeEach(async () => {
    usersServiceMock = {
      find: (): Promise<User[]> => Promise.resolve([]),
      create: ({ email, name, password }) =>
        Promise.resolve({
          email,
          name,
          password,
        } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create a new user with a salted and hashed password', async () => {
    const user = await service.signup(userDataSample);

    const [salt, hash] = user.password.split('.');

    expect(user.password).not.toEqual(userDataSample.password);
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('Should throw an error if user signs up with email that is in use', async () => {
    usersServiceMock.find = () => Promise.resolve([userDataSample as User]);

    await expect(service.signup(userDataSample)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('Should throw an error if user tries to sign in with a wrong or unused email', async () => {
    usersServiceMock.find = () => Promise.resolve([userDataSample as User]);

    const promise = service.signin('unused@test.com', userDataSample.password);

    await expect(promise).rejects.toThrow(BadRequestException);
  });

  it('Should throw an error if the user tries to sign in with a wrong password', async () => {
    usersServiceMock.find = () => Promise.resolve([userDataSample as User]);

    const promise = service.signin(userDataSample.email, 'WrongPassword!');

    await expect(promise).rejects.toThrow(BadRequestException);
  });

  it('Should return user data if the user provides correct password', async () => {
    usersServiceMock.find = () => Promise.resolve([userDataSample as User]);

    const user = await service.signin(userDataSample.email, 'Password1234!');

    expect(user).toBeDefined();
  });
});
