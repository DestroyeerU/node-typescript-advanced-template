import { Request, Response, NextFunction } from 'express';

import * as Yup from 'yup';

import { validateSchema } from '~/app/utils/yup';

const StoreSchema = Yup.object().shape({
  name: Yup.string().required(),
  password: Yup.string().required(),
  email: Yup.string().email().required(),
});

const UpdateSchema = Yup.object().shape({
  name: Yup.string(),
  password: Yup.string(),
  email: Yup.string().email(),
});

export async function validateStore(req: Request, res: Response, next: NextFunction) {
  const error = await validateSchema(StoreSchema, req.body);

  if (error) {
    return res.status(400).json(error);
  }

  return next();
}

export async function validateUpdate(req: Request, res: Response, next: NextFunction) {
  const error = await validateSchema(UpdateSchema, req.body);

  if (error) {
    return res.status(400).json(error);
  }

  return next();
}
