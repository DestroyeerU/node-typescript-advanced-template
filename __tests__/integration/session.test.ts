import supertest from 'supertest';

import { decodeToken } from '@utils/auth';

import App from '@/App';
import prisma from '@/services/prisma';

import { createToken } from '../factory/auth';
import { createUser } from '../factory/user';

describe('Session store', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  it('should authenticate with valid credentials', async () => {
    const { email } = await createUser({
      email: 'myEmail@gmail.com',
      password: 'password123',
    });

    const response = await supertest(App).post('/sessions').send({
      email,
      password: 'password123',
    });

    expect(response.status).toBe(200);
  });

  it('should get JWT token with id encrypted', async () => {
    const { id, email } = await createUser({
      email: 'myEmail@gmail.com',
      password: 'password123',
    });

    const response = await supertest(App).post('/sessions').send({
      email,
      password: 'password123',
    });

    const decodedToken = await decodeToken(response.body.token);

    expect(decodedToken?.id).toBe(id);
  });

  it('should not authenticate with invalid email format', async () => {
    const response = await supertest(App).post('/sessions').send({
      email: 'invalidEmail',
      password: 'pass123',
    });

    expect(response.status).toBe(400);
  });

  it('should not authenticate with email that does not exists', async () => {
    const response = await supertest(App).post('/sessions').send({
      email: 'nonUserEmail@gmail.com',
      password: 'pass123',
    });

    expect(response.status).toBe(400);
  });

  it('should not authenticate with wrong password', async () => {
    const { email } = await createUser({
      email: 'myEmail@gmail.com',
      password: 'password123',
    });

    const response = await supertest(App).post('/sessions').send({
      email,
      password: 'wrongPassword',
    });

    expect(response.status).toBe(401);
  });
});

describe('Access private routes', () => {
  it('should access private routes when authenticated', async () => {
    const token = await createToken();

    const response = await supertest(App).get('/testAuth').set({
      authorization: token,
    });

    expect(response.status).toBe(200);
  });

  it('should not access private routes without token', async () => {
    const response = await supertest(App).get('/authTest');

    expect(response.status).toBe(400);
  });

  it('should not access private routes with invalid token', async () => {
    const response = await supertest(App).get('/testAuth').set({
      authorization: 'invalidToken',
    });

    expect(response.status).toBe(400);
  });

  it('should not access private routes with token that contains id where user not exists', async () => {
    const token = await createToken({ id: -1 });

    const response = await supertest(App).get('/testAuth').set({
      authorization: token,
    });

    expect(response.status).toBe(401);
  });
});
