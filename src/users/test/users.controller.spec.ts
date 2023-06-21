import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { UUID, randomUUID } from 'crypto';
import { User } from '../user.entity';

describe('Tests for UsersController', () => {
  let controller: UsersController;
  let usersServiceMock: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    usersServiceMock = {
      find: ({ email }) => {
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
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
