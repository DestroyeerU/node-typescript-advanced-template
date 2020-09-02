import supertest from 'supertest';

import { comparePassword } from '@utils/auth';

import App from '@/App';
import prisma from '@/services/prisma';

import { generateUser, createUser } from '../factory/user';

describe('User store', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  it('should be able to register', async () => {
    const user = await generateUser();

    const response = await supertest(App).post('/users').send(user);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(user.name);
    expect(response.body.email).toBe(user.email);
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
    await createUser({
      email: 'testEmail@gmail.com',
    });

    const user2 = await generateUser({
      email: 'testEmail@gmail.com',
    });

    const result = await supertest(App).post('/users').send(user2);

    expect(result.status).toBe(400);
  });
});

describe('User show', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  it('should be able to index one user by id', async () => {
    const { id } = await createUser();

    const response = await supertest(App).get(`/users/${id}`);

    expect(response.body.id).toBe(id);
  });

  it('should not be able to index one user by invalid id', async () => {
    const { id } = await createUser();

    const response = await supertest(App).get(`/users/${id}Invalid`);

    expect(response.status).toBe(400);
  });
});

describe('User index', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  it('should be able to index 2 users', async () => {
    await createUser();
    await createUser({ email: 'otherEmail@gmail.com' });

    const response = await supertest(App).get('/users');

    expect(response.body.length).toBe(2);
  });
});

describe('User update', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  it('should be able to update name of one user', async () => {
    const { id } = await createUser();

    const response = await supertest(App).put(`/users/${id}`).send({
      name: 'novoNomeTeste',
    });

    expect(response.body.name).toBe('novoNomeTeste');
  });

  it('should not be able to update with invalid email', async () => {
    const { id } = await createUser();

    const responseUpdating = await supertest(App).put(`/users/${id}`).send({
      email: 'invalidEmail',
    });

    expect(responseUpdating.status).toBe(400);
  });

  it('should be able to update your email to the same one', async () => {
    const { id } = await createUser({
      email: 'testEmail123@gmail.com',
    });

    const response = await supertest(App).put(`/users/${id}`).send({
      email: 'testEmail123@gmail.com',
    });

    expect(response.body.email).toBe('testEmail123@gmail.com');
  });

  it('should not be able to update email that already pertences to other user', async () => {
    await createUser({
      email: 'testEmail123@gmail.com',
    });

    const user2 = await createUser({
      email: 'otherEmail@gmail.com',
    });

    const response = await supertest(App).put(`/users/${user2.id}`).send({
      email: 'testEmail123@gmail.com',
    });

    expect(response.status).toBe(400);
  });
});

describe('User delete', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  it('should be able to delete one user by id', async () => {
    const { id } = await createUser();

    const response = await supertest(App).delete(`/users/${id}`);

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(id);
  });

  it('should not be able to delete one user by invalid id', async () => {
    const response = await supertest(App).delete(`/users/InvalidId`);

    expect(response.status).toBe(400);
  });
});
