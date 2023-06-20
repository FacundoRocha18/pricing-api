import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';

it('should be defined', async () => {
  const usersServiceMock = {
    find: () => Promise.resolve([]),
    create: (email: string, password: string) =>
      Promise.resolve({ id: 1, email, password }),
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

  const service = module.get<AuthService>(AuthService);
  expect(service).toBeDefined();
});
