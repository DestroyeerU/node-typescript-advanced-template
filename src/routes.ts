import { Router } from 'express';

import SessionController from '~/app/controllers/Users/SessionController';
import * as SessionValidations from '~/app/validations/User/session';

const routes = Router();

routes.get('/', async (req, res) => res.json({ ok: true }));

routes.post('/session', SessionValidations.validateStore, SessionController.store);

export default routes;
