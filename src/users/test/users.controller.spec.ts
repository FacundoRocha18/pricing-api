import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { UUID, randomUUID } from 'crypto';
import { User } from '../user.entity';
import { hashPassword } from '../../utils';

describe('Tests for UsersController', () => {
  let controller: UsersController;
  let usersServiceMock: Partial<UsersService>;
  let testUser: User;

  beforeEach(async () => {
    const users: User[] = [];

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
      create: ({ email, name, password }) => {
        const user = { id: randomUUID(), email, name, password };

        users.push(user);

        return Promise.resolve(user);
      },
      update: (id: UUID, attrs: Partial<User>) => Promise.resolve({} as User),
      delete: (id: UUID) => id,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);

    testUser = await controller.createUser({
      email: 'test@test.com',
      name: 'Test',
      password: await hashPassword('Password1234!'),
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findUserById() should return the user that matches the provided id', async () => {
    const user = await controller.findUserById(testUser.id);

    expect(user).toBeDefined();
    expect(user.id).toEqual(testUser.id);
  });

  it('findUserByEmail() should return the user that matches the provided email', async () => {
    const user = await controller.findUserByEmail(testUser.email);

    expect(user).toBeDefined();
    expect(user.email).toEqual(testUser.email);
  });

  it('listUsers() should return all users', async () => {
    const user = await controller.listUsers();

    expect(user).toBeDefined();
    expect(user.length).toBeGreaterThan(0);
  });

  it('listUser() should create a new user and return it', async () => {
    const user = await controller.createUser({
      email: 'test@test.com',
      name: 'Test',
      password: 'Password1234!',
    });

    const { password } = await controller.findUserById(user.id);

    const [salt] = password.split('.');

    expect(user).toBeDefined();
    expect(user.email).toEqual('test@test.com');
    expect(user.name).toEqual('Test');
    expect(user.password).toEqual(await hashPassword('Password1234!', salt));
  });
});
