import './bootstrap';

import express, { Express } from 'express';

import routes from './routes';

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
    // Code here, like an route
  }
}

export default new App().server;
