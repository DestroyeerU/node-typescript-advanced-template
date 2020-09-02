import { Router } from 'express';

import multer from 'multer';

import FileController from '@controllers/FileController';
import SessionController from '@controllers/Users/SessionController';
import UserController from '@controllers/Users/UserController';

import authMiddleware from '@middlewares/auth';

import * as GlobalValidations from '@validations/index';
import * as SessionValidations from '@validations/User/session';
import * as UserValidations from '@validations/User/user';

import multerConfig from '@config/muter';

const routes = Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionValidations.validateStore, SessionController.store);

routes.get('/users', UserController.index);
routes.get('/users/:id', GlobalValidations.validateParamsId, UserController.show);
routes.post('/users', UserValidations.validateStore, UserController.store);
routes.put('/users/:id', GlobalValidations.validateParamsId, UserValidations.validateUpdate, UserController.update);
routes.delete('/users/:id', GlobalValidations.validateParamsId, UserController.delete);

routes.post('/files', upload.single('file'), FileController.store);

routes.use(authMiddleware);

routes.get('/testAuth', async (req, res) => {
  return res.json({ message: 'You are authenticated!' });
});

export default routes;
