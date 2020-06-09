import { Router } from 'express';
import multer from 'multer';

import multerConfig from '~/config/muter';

import FileController from '~/app/controllers/FileController';
import SessionController from '~/app/controllers/Users/SessionController';

import * as SessionValidations from '~/app/validations/User/session';

const routes = Router();
const upload = multer(multerConfig);

routes.get('/', async (req, res) => res.json({ ok: true }));

routes.post('/session', SessionValidations.validateStore, SessionController.store);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
