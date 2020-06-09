import { Request, Response, NextFunction } from 'express';
import { decodeToken } from '../utils/auth';

interface AuthRequest extends Request {
  userId?: number;
}

export default async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided.' });
  }

  const [, token] = authHeader.split(' ');

  const tokenDecoded = await decodeToken(token);
  if (!tokenDecoded) {
    return res.status(401).json({ error: 'Token Invalid.' });
  }

  req.userId = tokenDecoded.id;
  return next();
};
