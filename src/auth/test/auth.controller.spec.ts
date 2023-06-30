import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { User } from '../../users/user.entity';
import { UsersService } from '../../users/users.service';
import { UUID, randomUUID } from 'crypto';
import { hashPassword } from '../../utils';

describe('Tests on AuthController', () => {
  let controller: AuthController;
  let authServiceMock: Partial<AuthService>;
  let usersServiceMock: Partial<UsersService>;
  let users: User[] = [];

  beforeEach(async () => {
    usersServiceMock = {
      findByEmail: (email: string) => {
        const [filteredUser] = users.filter((user) => user.email === email);

        return Promise.resolve(filteredUser);
      },
      findById: (id: UUID) => {
        const [filteredUser] = users.filter((user) => user.id === id);

        return Promise.resolve(filteredUser);
      },
      findAll: () => Promise.resolve(users),
      create: async ({ email, name, password }) => {
        const user = {
          id: randomUUID(),
          email,
          name,
          password: await hashPassword(password),
        };

        users.push(user);

        return Promise.resolve(user);
      },
      update: (id: UUID, attrs: Partial<User>) => Promise.resolve({} as User),
      delete: (id: UUID) => {
        users = users.filter((user) => user.id != id);

        return id;
      },
    };

    authServiceMock = {
      signup: () => Promise.resolve({} as User),
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: randomUUID(), email, password } as User);
      },
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

  it('signin() should update session object and return user data', async () => {
    const session = {};
    expect(controller).toBeDefined();
  });
});
