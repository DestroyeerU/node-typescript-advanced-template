import supertest from 'supertest';

import { decodeToken, encodeToken } from '@utils/auth';

import App from '@/App';
import prisma from '@/services/prisma';

import { generateUser } from '../factory/user';
import { Request } from '../utils/request';

const authRequest = Request(App);

describe('Session store', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  it('should authenticate with valid credentials', async () => {
    const user = await generateUser({
      email: 'myEmail@gmail.com',
      password: 'password123',
    });

    await supertest(App).post('/users').send(user);

    const response = await supertest(App).post('/sessions').send({
      email: user.email,
      password: user.password,
    });

    console.log(response.body);

    expect(response.status).toBe(200);
  });

  it('should get JWT token with id encrypted', async () => {
    const user = await generateUser({
      email: 'myEmail@gmail.com',
      password: 'password123',
    });

    const userResponse = await supertest(App).post('/users').send(user);

    const response = await supertest(App).post('/sessions').send({
      email: user.email,
      password: user.password,
    });

    const decodedToken = await decodeToken(response.body.token);

    expect(decodedToken?.id).toBe(userResponse.body.id);
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
    const user = await generateUser({
      email: 'myEmail@gmail.com',
      password: 'password123',
    });

    await supertest(App).post('/users').send(user);

    const response = await supertest(App).post('/sessions').send({
      email: user.email,
      password: 'wrongPassword',
    });

    expect(response.status).toBe(401);
  });
});

describe('Access private routes', () => {
  it('should access private routes when authenticated', async () => {
    const response = await authRequest.makeRequest({
      method: 'get',
      path: '/testAuth',
    });

    expect(response.status).toBe(200);
  });

  it('should not access private routes without token', async () => {
    const response = await supertest(App).get('/authTest');

    expect(response.status).toBe(400);
  });

  it('should not access private routes with invalid token', async () => {
    const response = await authRequest.makeRequest({
      method: 'get',
      path: '/testAuth',
      tokenState: { token: 'invalidToken' },
    });

    expect(response.status).toBe(400);
  });

  it('should not access private routes with token that contains id where user not exists', async () => {
    const token = encodeToken({ id: 0 });

    const response = await authRequest.makeRequest({
      method: 'get',
      path: '/testAuth',
      tokenState: { token },
    });

    expect(response.status).toBe(401);
  });
});
