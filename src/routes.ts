import { Router } from 'express';
import multer from 'multer';

import multerConfig from '~/config/muter';

import FileController from '~/app/controllers/FileController';
import SessionController from '~/app/controllers/Users/SessionController';
import UserController from './app/controllers/Users/UserController';

import * as SessionValidations from '~/app/validations/User/session';
import * as UserValidations from '~/app/validations/User/user';

import * as GlobalValidations from '~/app/validations/';

const routes = Router();
const upload = multer(multerConfig);

routes.post('/session', SessionValidations.validateStore, SessionController.store);

routes.get('/users', UserController.index);
routes.get('/users/:id', GlobalValidations.validateParamsId, UserController.show);
routes.post('/users', UserValidations.validateStore, UserController.store);
routes.put('/users/:id', GlobalValidations.validateParamsId, UserValidations.validateUpdate, UserController.update);
routes.delete('/users/:id', GlobalValidations.validateParamsId, UserController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
