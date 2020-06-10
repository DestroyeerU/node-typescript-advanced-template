import faker from 'faker';

interface UserParams {
  name?: string;
  email?: string;
  password?: string;
}

export function generateUser(params?: UserParams) {
  const user = {
    name: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  return {
    ...user,
    ...params,
  };
}
