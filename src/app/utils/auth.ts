import jwt from 'jsonwebtoken';

import authConfig from '@config/auth';

interface TokenObject {
  id: number;
}

export function encodeToken(objectToEncode: TokenObject) {
  return jwt.sign({ id: objectToEncode.id }, authConfig.appSecret);
}

export async function decodeToken(token: string) {
  try {
    const tokenDecoded = jwt.verify(token, authConfig.appSecret);
    // const tokenDecoded = await promisify(jwt.verify)(token, authConfig.appSecret);

    return tokenDecoded as TokenObject;
  } catch (err) {
    return undefined;
  }
}
