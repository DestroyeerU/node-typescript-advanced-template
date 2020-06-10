import { hashPassword, comparePassword, encodeToken, decodeToken } from '../../src/app/utils/auth';

describe('Hash String', () => {
  it('should hash a string and compare correctly', async () => {
    const stringHashed = await hashPassword('string123');
    const isSameString = await comparePassword('string123', stringHashed);

    expect(isSameString).toBeTruthy();
  });
});

describe('encode/decode Token', () => {
  it('should encrypt a object with id', async () => {
    const token = encodeToken({ id: 12 });
    const tokenDecoded = await decodeToken(token);

    expect(tokenDecoded?.id).toBe(12);
  });

  it('should return undefined with invalid token to decode', async () => {
    const tokenDecoded = await decodeToken('InvalidTokenString');

    expect(tokenDecoded).toBeUndefined();
  });
});
