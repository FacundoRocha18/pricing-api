import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { User } from 'src/users/user.entity';
import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';

describe('Tests for AuthService', () => {
  let service: AuthService;
  let usersServiceMock: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    usersServiceMock = {
      findUserByEmailNoValidation: (email: string) => {
        const [user] = users.filter((user) => user.email === email);

        return Promise.resolve(user);
      },
      create: ({ email, name, password }) => {
        const user = { id: randomUUID(), email, name, password };

        users.push(user);

        return Promise.resolve(user);
      },
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
    const user = await service.signup({
      email: 'test@test.com',
      name: 'Test',
      password: 'Password1234!',
    });

    const [salt, hash] = user.password.split('.');

    expect(user.password).not.toEqual('Password1234!');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('Should throw a BadRequestException if user signs up with an email that is already in use', async () => {
    const user = await service.signup({
      email: 'test@test.com',
      name: 'Test',
      password: 'Password1234!',
    });

    const promise = service.signup(user);

    await expect(promise).rejects.toThrow(BadRequestException);
  });

  it('Should throw a BadRequestException if user tries to sign in with a wrong or unused email', async () => {
    await service.signup({
      email: 'test@test.com',
      name: 'Test',
      password: 'Password1234!',
    });

    const promise = service.signin('unused@test.com', 'Password1234!');

    await expect(promise).rejects.toThrow(BadRequestException);
  });

  it('Should throw a BadRequestException if the user tries to sign in with a wrong password', async () => {
    const user = await service.signup({
      email: 'test@test.com',
      name: 'Test',
      password: 'Password1234!',
    });

    const promise = service.signin(user.email, 'WrongPassword!');

    await expect(promise).rejects.toThrow(BadRequestException);
  });

  it('Should return user data if the user provides correct password', async () => {
    const newUser = await service.signup({
      email: 'test@test.com',
      name: 'Test',
      password: 'Password1234!',
    });

    const user = await service.signin(newUser.email, 'Password1234!');

    expect(user).toBeDefined();
  });
});
