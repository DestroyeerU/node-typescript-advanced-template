import { Request, Response } from 'express';

import prisma from '~/prisma';
import { comparePassword, encodeToken } from '~/app/utils/auth';

interface StoreRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

class SessionController {
  async store(req: StoreRequest, res: Response) {
    const { password, email } = req.body;

    const user = await prisma.user.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const samePassword = await comparePassword(password, user.password);
    if (!samePassword) {
      return res.status(401).json({ error: 'Wrong email or password' });
    }

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },

      token: encodeToken(user),
    });
  }
}

export default new SessionController();
