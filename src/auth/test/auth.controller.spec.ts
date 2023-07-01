import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { User } from '../../users/user.entity';
import { UsersService } from '../../users/users.service';
import { UUID, randomUUID } from 'crypto';
import { hashPassword } from '../../utils';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

describe('Tests on AuthController', () => {
  let controller: AuthController;
  let authServiceMock: Partial<AuthService>;
  let usersServiceMock: Partial<UsersService>;

  const testUserData: User = {
    id: 'bf229f23-48f6-4dbc-b44d-2732f855ec7d',
    email: 'test@test.com',
    name: 'Test Test',
    password: 'Password1234!',
  };

  beforeEach(async () => {
    let users: User[] = [];

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
      signup: ({ email, name, password }: CreateUserDto) => {
        return Promise.resolve({
          id: 'bf229f23-48f6-4dbc-b44d-2732f855ec7d',
          email,
          name,
          password,
        } as User);
      },
      signin: (email: string, password: string) => {
        return Promise.resolve({
          id: 'bf229f23-48f6-4dbc-b44d-2732f855ec7d',
          email,
          name: 'Test Test',
          password,
        } as User);
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

  it('signUp() should create a new user and return session object and return user data', async () => {
    const session = { id: '' };
    const user = await controller.signIn(testUserData, session);

    expect(user).toEqual(testUserData);
    expect(session.id).toEqual(testUserData.id);
  });

  it('signIn() should update session object and return user data', async () => {
    const session = { id: '' };
    const user = await controller.signIn(
      {
        email: 'test@test.com',
        password: 'Password1234!',
      },
      session,
    );

    expect(user.id).toEqual(testUserData.id);
    expect(session.id).toEqual(testUserData.id);
  });

  it('identify() should return the current session user', () => {
    const user = controller.identify(testUserData);

    expect(user).toEqual(testUserData);
  });

  it('signOut() should update session object and return null', () => {
    const session = { id: 'bf229f23-48f6-4dbc-b44d-2732f855ec7d' };
    controller.signOut(session);

    expect(session.id).toEqual(null);
  });
});
