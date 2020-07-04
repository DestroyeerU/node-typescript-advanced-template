import supertest from 'supertest';

import { comparePassword, decodeToken, encodeToken } from '~/app/utils/auth';

import App from '~/App';
import prisma from '~/prisma';

import { generateUser } from '../factory/user';
import { Request, useAuthorization } from '../utils/request';

const authRequest = Request(App);

describe('User store', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  it('should be able to register', async () => {
    const user = await generateUser();

    const response = await supertest(App).post('/users').send(user);

    expect(response.body).toHaveProperty('id');
  });

  it('should have a hash passoword', async () => {
    const user = await generateUser({
      password: 'password123',
    });

    const response = await supertest(App).post('/users').send(user);

    const isSamePassword = await comparePassword('password123', response.body.password);
    expect(isSamePassword).toBeTruthy();
  });

  it('should not be able to register with invalid email', async () => {
    const user = await generateUser({
      email: 'invalidEmail',
    });

    const response = await supertest(App).post('/users').send(user);

    expect(response.status).toBe(400);
  });

  it('should not be able to register with duplicated email', async () => {
    const user1 = await generateUser({
      email: 'testEmail@gmail.com',
    });

    const user2 = await generateUser({
      email: 'testEmail@gmail.com',
    });

    await supertest(App).post('/users/').send(user1);
    const result = await supertest(App).post('/users/').send(user2);

    expect(result.status).toBe(400);
  });
});

describe('User index', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  it('should be able to index all users', async () => {
    const user1 = await generateUser();
    const user2 = await generateUser({ email: 'otherEmail@gmail.com' });

    await supertest(App).post('/users').send(user1);
    await supertest(App).post('/users').send(user2);

    const response = await supertest(App).get('/users');

    expect(response.body.length).toBe(2);
  });

  it('should be able to index one user by id', async () => {
    const user = await generateUser();

    const { body: userCreted } = await supertest(App).post('/users').send(user);

    const response = await supertest(App).get(`/users/${userCreted.id}`);

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(userCreted.id);
  });

  it('should not be able to index one user by invalid id', async () => {
    const user = await generateUser();

    const { body: userCreted } = await supertest(App).post('/users').send(user);

    const response = await supertest(App).get(`/users/${userCreted.id}Invalid`);

    expect(response.status).toBe(400);
  });

  it('should be able to delete one user by id', async () => {
    const user = await generateUser();

    const { body: userCreted } = await supertest(App).post('/users').send(user);

    const response = await supertest(App).delete(`/users/${userCreted.id}`);

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(userCreted.id);
  });

  it('should not be able to delete one user by invalid id', async () => {
    const user = await generateUser();

    const { body: userCreted } = await supertest(App).post('/users').send(user);

    const response = await supertest(App).delete(`/users/${userCreted.id}Invalid`);

    expect(response.status).toBe(400);
  });
});

describe('User update', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  it('should be able to update fields', async () => {
    const user = await generateUser();

    const response = await supertest(App).post('/users').send(user);
    const responseUpdating = await supertest(App).put(`/users/${response.body.id}`).send({
      name: 'novoNomeTeste',
    });

    expect(responseUpdating.body.name).toBe('novoNomeTeste');
  });

  it('should not be able to update with invalid email', async () => {
    const user = await generateUser();

    const response = await supertest(App).post('/users').send(user);
    const responseUpdating = await supertest(App).put(`/users/${response.body.id}`).send({
      email: 'invalidEmail',
    });

    expect(responseUpdating.status).toBe(400);
  });

  it('should be able to update your email to the same one', async () => {
    const user = await generateUser({
      email: 'testEmail123@gmail.com',
    });

    const response = await supertest(App).post('/users').send(user);

    const responseUpdating = await supertest(App).put(`/users/${response.body.id}`).send({
      email: 'testEmail123@gmail.com',
    });

    expect(responseUpdating.body.email).toBe('testEmail123@gmail.com');
  });

  it('should not be able to update email that already pertences to other user', async () => {
    const user1 = await generateUser({
      email: 'testEmail123@gmail.com',
    });

    const user2 = await generateUser({
      email: 'otherEmail@gmail.com',
    });

    await supertest(App).post('/users').send(user1);
    const responseUser2 = await supertest(App).post('/users').send(user2);

    const responseUpdating = await supertest(App).put(`/users/${responseUser2.body.id}`).send({
      email: 'testEmail123@gmail.com',
    });

    expect(responseUpdating.status).toBe(400);
  });
});

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

    const response = await supertest(App).post('/session').send({
      email: user.email,
      password: user.password,
    });

    expect(response.status).toBe(200);
  });

  it('should get JWT token with id encrypted', async () => {
    const user = await generateUser({
      email: 'myEmail@gmail.com',
      password: 'password123',
    });

    const userResponse = await supertest(App).post('/users').send(user);

    const response = await supertest(App).post('/session').send({
      email: user.email,
      password: user.password,
    });

    const decodedToken = await decodeToken(response.body.token);

    expect(decodedToken?.id).toBe(userResponse.body.id);
  });

  it('should not authenticate with invalid email format', async () => {
    const response = await supertest(App).post('/session').send({
      email: 'invalidEmail',
      password: 'pass123',
    });

    expect(response.status).toBe(400);
  });

  it('should not authenticate with email that does not exists', async () => {
    const response = await supertest(App).post('/session').send({
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

    const response = await supertest(App).post('/session').send({
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
