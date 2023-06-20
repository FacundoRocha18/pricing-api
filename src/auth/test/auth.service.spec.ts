import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { User } from 'src/users/user.entity';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersServiceMock: Partial<UsersService>;
  const userDataSample = {
    email: 'test@test.com',
    name: 'Test',
    password: 'Password1234!',
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user with a salted and hashed password', async () => {
    const user = await service.signup(userDataSample);

    const [salt, hash] = user.password.split('.');

    expect(user.password).not.toEqual(userDataSample.password);
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    usersServiceMock.find = () =>
      Promise.resolve([
        {
          id: 'bf229f23-48f6-4dbc-b44d-2732f855ec7d',
          email: 'test@test.com',
          name: 'Test',
          password: 'Password1234!',
        } as User,
      ]);

    await expect(service.signup(userDataSample)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws an error if user tries to sign in with an unused email', async () => {
    usersServiceMock.find = () => {
      return Promise.resolve([
        {
          id: 'bf229f23-48f6-4dbc-b44d-2732f855ec7d',
          email: 'test@test.com',
          name: 'Test',
          password: 'Password1234!',
        } as User,
      ]);
    };

    await expect(
      service.signin(userDataSample.email, userDataSample.password),
    ).rejects.toThrow(BadRequestException);
  });
});
