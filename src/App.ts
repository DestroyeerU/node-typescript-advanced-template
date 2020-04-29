// import express from 'express';

// import routes from './routes';

// const server = express();

// server.use(express.json());
// server.use(routes);

// export default server;

import 'dotenv/config';

import Youch from 'youch';
import express, { Express } from 'express';
import 'express-async-errors';

import routes from './routes';

import './database';

class App {
  server: Express;

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;