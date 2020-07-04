import './bootstrap';

import path from 'path';

import express, { Express } from 'express';
import 'express-async-errors';

import routes from './routes';

const uploadUrl = path.resolve(__dirname, '..', 'tmp', 'uploads');

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
    this.server.use('/files', express.static(uploadUrl));
  }

  routes() {
    this.server.use(routes);
  }

  exceptionHandler() {
    // Code here, like an route
  }
}

export default new App().server;
