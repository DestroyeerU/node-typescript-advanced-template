import { Request, Response, NextFunction } from 'express';

import * as Yup from 'yup';

import { validateSchema } from '~/app/utils/yup';

const StoreSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

export async function validateStore(req: Request, res: Response, next: NextFunction) {
  const error = await validateSchema(StoreSchema, req.body);

  if (error) {
    return res.status(400).json(error);
  }

  return next();
}
