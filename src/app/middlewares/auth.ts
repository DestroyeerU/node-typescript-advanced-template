import { Request, Response, NextFunction } from 'express';

import prisma from '~/prisma';

import { decodeToken } from '../utils/auth';

interface AuthRequest extends Request {
  userId?: number;
}

export default async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({ error: 'Token not provided.' });
  }

  const [, token] = authHeader.split(' ');
  const tokenDecoded = await decodeToken(token);

  if (!tokenDecoded) {
    return res.status(400).json({ error: 'Token Invalid.' });
  }

  const { id } = tokenDecoded;
  const user = await prisma.user.findOne({ where: { id } });

  if (!user) {
    return res.status(401).json({ error: 'User not found.' });
  }

  req.userId = tokenDecoded.id;
  return next();
};
