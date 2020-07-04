import { Request, Response } from 'express';

import { User } from '@prisma/client';

import { hashPassword } from '~/app/utils/auth';

import { RequestBody, RequestParamsId, RequestBodyParamsId } from '~/types';

import prisma from '~/prisma';

type UserRequest = Omit<User, 'id'>;

type StoreRequest = RequestBody<UserRequest>;
type UpdateRequest = RequestBodyParamsId<UserRequest>;

class UserController {
  async index(req: Request, res: Response) {
    const allUsers = await prisma.user.findMany();

    return res.json(allUsers);
  }

  async show(req: RequestParamsId, res: Response) {
    const { id } = req.params;

    const user = await prisma.user.findOne({ where: { id: +id } });

    return res.json(user);
  }

  async store(req: StoreRequest, res: Response) {
    const { name, password, email } = req.body;

    const userAlreadyExists = await prisma.user.findOne({ where: { email } });

    if (userAlreadyExists) {
      return res.status(400).send('User already exists');
    }

    const passwordHashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHashed,
      },
    });

    return res.json(user);
  }

  async update(req: UpdateRequest, res: Response) {
    const { email } = req.body;
    const { id } = req.params;

    if (email) {
      const userAlreadyExists = await prisma.user.findOne({ where: { email } });

      if (userAlreadyExists && userAlreadyExists.id !== +id) {
        return res.status(400).send('User already exists');
      }
    }

    const user = await prisma.user.update({
      where: { id: +id },
      data: req.body,
    });

    return res.json(user);
  }

  async delete(req: RequestParamsId, res: Response) {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: +id },
    });

    return res.status(201).json({ id: +id });
  }
}

export default new UserController();
