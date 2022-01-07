import dotenv from 'dotenv';
import express from 'express';
import { ConfigParams, auth } from 'express-openid-connect';
import * as http from 'http';
import path from 'path';
import 'reflect-metadata';

import authController from '$/auth/auth.controller';
import { log, logger } from '$/common/logger';
import * as db from '$/db';
import { errorMiddleware } from '$/middleware/error.middleware';
import { notFoundMiddleware } from '$/middleware/not-found.middleware';
import { userMiddleware } from '$/middleware/user.middleware';
import userController from '$/user/user.controller';
import viewEngineController from '$/view-engine/view-engine.controller';

dotenv.config();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const config: ConfigParams = {
  authRequired: false,
  auth0Logout: true,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  secret: process.env.AUTH0_SECRET,
};

const host = process.env.API_HOST || 'localhost';
const port = process.env.API_PORT || 3000;
if (!config.baseURL && process.env.API_PORT && process.env.NODE_ENV !== 'production') {
  config.baseURL = `http://${host}:${port}`;
}

app.use(auth(config));

// Pre-controller middleware
app.use(userMiddleware);

// Controllers
const routes = express
  .Router()
  .use('/', viewEngineController)
  .use('/api/v1/auth', authController)
  .use('/api/v1', userController);
app.use('/', routes);

// Post controller middleware
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const server: http.Server = http.createServer(app);

void (async () => {
  try {
    await db.init();
  } catch (error) {
    log(`Database: Error connecting!`);
    return error;
  }
  server.listen(port, () => {
    log(`Listening on ${config.baseURL!}`);
  });
})();
