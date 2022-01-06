import dotenv from 'dotenv';
import express from 'express';
import { ConfigParams, auth } from 'express-openid-connect';
import * as http from 'http';
import path from 'path';

import { logger } from '$/common/logger';
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
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  secret: process.env.SECRET,
};

const port = process.env.PORT || 3000;
if (!config.baseURL && process.env.PORT && process.env.NODE_ENV !== 'production') {
  config.baseURL = `http://localhost:${port}`;
}

app.use(auth(config));

// Pre-controller middleware
app.use(userMiddleware);

// Controllers
const routes = express.Router().use('/', viewEngineController).use('/api/v1', userController);
app.use('/', routes);

// Post controller middleware
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const server: http.Server = http.createServer(app);
server.listen(port, () => {
  console.log(`Listening on ${config.baseURL!}`);
});
