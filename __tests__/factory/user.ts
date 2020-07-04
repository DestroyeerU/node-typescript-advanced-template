import faker from 'faker';

import { hashPassword } from '~/app/utils/auth';

import prisma from '~/prisma';

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
  const userData = await generateUser(params, encodePassword);

  return prisma.user.create({
    data: userData,
  });
}
