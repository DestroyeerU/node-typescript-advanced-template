import prisma from '~/prisma';
import { hashPassword, encodeToken } from '~/app/utils/auth';

export function useAuthorization() {
  let tokenState = '';

  async function createSessionAndSetToken() {
    const encryptedPassword = await hashPassword('password123');

    const user = await prisma.user.create({
      data: {
        name: 'Test',
        email: 'myEmail@gmail.com',
        password: encryptedPassword,
      },
    });

    tokenState = encodeToken(user);
  }

  async function clean() {
    await prisma.user.delete({ where: { email: 'myEmail@gmail.com' } });

    tokenState = '';
  }

  async function token() {
    if (tokenState === '') {
      await createSessionAndSetToken();
    }

    return tokenState;
  }

  return { token, clean };
}
