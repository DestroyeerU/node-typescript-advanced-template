import faker from 'faker';

import prisma from '@services/prisma';

import { hashPassword } from '@utils/auth';

export interface FactoryUser {
  name?: string;
  email?: string;
  password?: string;
}

type Separate = [string, Omit<FactoryUser, 'password'> | null];

function separate(params?: FactoryUser) {
  if (params?.password) {
    const { password, ...restData } = params;

    return [password, restData || {}] as Separate;
  }

  return [faker.internet.password(), params || {}] as Separate;
}

export async function generateUser(params?: FactoryUser, encodePassword?: boolean) {
  const [password, userData] = separate(params);

  const userPassword = encodePassword ? await hashPassword(password) : password;

  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: userPassword,
    ...userData,
  };
}

export async function createUser(params?: FactoryUser, encodePassword?: boolean) {
  const shouldEncodePassword = encodePassword === undefined ? true : encodePassword;
  const userData = await generateUser(params, shouldEncodePassword);

  return prisma.user.create({
    data: userData,
  });
}
