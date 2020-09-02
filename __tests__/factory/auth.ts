import { encodeToken } from '@utils/auth';

import { createUser } from './user';

interface CreateTokenParams {
  id?: number;
}

export async function createToken(params?: CreateTokenParams) {
  async function getTargetObject() {
    if (params?.id) {
      return { id: params.id };
    }

    const user = await createUser();
    return user;
  }

  const targetObject = await getTargetObject();
  const token = encodeToken(targetObject);

  return `Bearer ${token}`;
}
