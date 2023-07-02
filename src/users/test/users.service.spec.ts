import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { User } from '../user.entity';

describe('Tests for UsersService', () => {
  let testUser: User;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);

    testUser = await service.create({
      email: 'test@test.com',
      name: 'Test',
      password: 'Password1234!',
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create a new user with a salted and hashed password', async () => {
    const [salt, hash] = testUser.password.split('.');

    expect(testUser.password).not.toEqual('Password1234!');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });
});
