import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { UUID, randomUUID } from 'crypto';
import { User } from '../user.entity';
import { hashPassword } from '../../utils';

describe('Tests for UsersController', () => {
  let controller: UsersController;
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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findUser should return the user with the provided email', async () => {
    await controller.create({
      email: 'test@test.com',
      name: 'Test',
      password: await hashPassword('Password1234!'),
    });

    const user = await controller.findUserById({ email: 'test@test.com' });

    console.log(user);
    expect(user.email).toEqual('test@test.com');
  });
});
