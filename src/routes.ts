import { Router } from 'express';

import authMiddleware from '@middlewares/auth';

const routes = Router();

routes.get('/', async (req, res) => {
  return res.json({ message: 'Hey there!' });
});

routes.use(authMiddleware);

routes.get('/testAuth', async (req, res) => {
  return res.json({ message: 'You are authenticated!' });
});

export default routes;
