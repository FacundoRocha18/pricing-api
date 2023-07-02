import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { randomUUID } from 'crypto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', async () => {
    const testEmail = `e2e.test-${randomUUID().toString()}@email.com`;

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: testEmail,
        name: 'e2e test',
        password: 'Password1234!',
      })
      .expect(201);

    const { id, email } = res.body;
    expect(id).toBeDefined();
    expect(email).toEqual(testEmail);
  });

  it('handles a signin request', async () => {
    const testEmail = `e2e.test-${randomUUID().toString()}@email.com`;

    console.log(testEmail);
    const { body: user } = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: testEmail,
        name: 'e2e test',
        password: '1234',
      })
      .expect(201);

    console.log(user.email);
    const res = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: user.email,
        password: '1234',
      })
      .expect(201);

    const { id, email } = res.body;
    expect(id).toBeDefined();
    expect(email).toEqual(testEmail);
  });

  it('signup as a new user then get the currently logged user', async () => {
    const testEmail = `e2e.test-${randomUUID().toString()}@email.com`;

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: testEmail,
        name: 'e2e test2',
        password: 'Password1234!',
      })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/identify')
      .set('Cookie', cookie)
      .expect(200);

    expect(cookie).toBeDefined();
    expect(body.email).toEqual(testEmail);
  });
});
