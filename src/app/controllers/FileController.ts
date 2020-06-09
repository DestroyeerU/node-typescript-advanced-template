import { Request, Response } from 'express';

import prisma from '~/prisma';

class FileController {
  async store(req: Request, res: Response) {
    const { originalname: name, filename: path } = req.file;

    const file = await prisma.file.create({
      name,
      path,
    });

    return res.json(file);
  }
}

export default new FileController();
