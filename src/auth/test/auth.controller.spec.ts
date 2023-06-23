import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { User } from '../../users/user.entity';
import { UsersService } from '../../users/users.service';
import { randomUUID } from 'crypto';

describe('Tests on AuthController', () => {
  let controller: AuthController;
  let authServiceMock: Partial<AuthService>;
  let usersServiceMock: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    usersServiceMock = {
      listAll: ({ email }) => {
        const filteredUsers = users.filter((user) => user.email === email);

        return Promise.resolve(filteredUsers);
      },
      create: ({ email, name, password }) => {
        const user = { id: randomUUID(), email, name, password };

        users.push(user);

        return Promise.resolve(user);
      },
    };

    authServiceMock = {
      signup: () => Promise.resolve({} as User),
      signin: () => Promise.resolve({} as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
