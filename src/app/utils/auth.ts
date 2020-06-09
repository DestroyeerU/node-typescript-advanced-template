import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '~/config/auth';

interface TokenObject {
  id: number;
}

const rounds = 8;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, rounds);
}

export async function comparePassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export function encodeToken(objectToEncode: TokenObject) {
  return jwt.sign({ id: objectToEncode.id }, authConfig.appSecret);
}

export async function decodeToken(token: string) {
  try {
    const tokenDecoded = await promisify(jwt.verify)(token, authConfig.appSecret);

    return tokenDecoded as TokenObject;
  } catch (err) {
    return undefined;
  }
}
