import { User } from '@prisma/client';
import faker from 'faker';
import supertest from 'supertest';

import { encodeToken } from '~/app/utils/auth';

import prisma from '~/prisma';

import { createUser } from '../../factory/user';
import { UseAutorization, Autorizations, Token, MakeRequest } from './types';

export function useAuthorization({ key }: UseAutorization) {
  const authorizations = {} as Autorizations;

  async function createSessionAndSetToken() {
    const user = await createUser({ email: faker.internet.email() });
    const encodedToken = encodeToken(user);

    authorizations[key] = {
      token: encodedToken,
      user,
    };
  }

  async function clean() {
    if (!authorizations[key] && authorizations[key].user) {
      return;
    }

    const { user } = authorizations[key];
    await prisma.user.delete({ where: { email: user.email } });

    authorizations[key] = {
      token: '',
      user: {} as User,
    };
  }

  async function token() {
    if (!authorizations[key] || authorizations[key].token === '') {
      await createSessionAndSetToken();
    }

    const { ...tokenRest } = authorizations[key];

    return tokenRest;
  }

  return { token, clean };
}

export function Request(App: unknown, useAutorization?: UseAutorization) {
  const request = supertest(App);
  const authorization = useAuthorization({ key: useAutorization?.key || Math.random().toString() });

  async function getToken(tokenState?: Token) {
    if (tokenState?.token) {
      console.log('aki');
      console.log(tokenState.token);

      return tokenState.token;
    }

    await authorization.token();
    await authorization.clean();

    const newTokenState = await authorization.token();

    return newTokenState.token;
  }

  async function makeRequest({ method, path, body, tokenState }: MakeRequest) {
    const tokenToSend = await getToken(tokenState);

    return request[method](path).send(body).set('authorization', `Bearer ${tokenToSend}`);
  }

  return { makeRequest };
}
