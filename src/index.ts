import dotenv from 'dotenv';
import express from 'express';
import { ConfigParams, auth } from 'express-openid-connect';
import * as http from 'http';
import createHttpError, { HttpError } from 'http-errors';
import morgan from 'morgan';
import path from 'path';

import { router } from '$/routes';

dotenv.config();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));

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

// Middleware to make the `user` object available to all views
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.locals.user = req.oidc.user;
  next();
});

app.use('/', router);

// Catch 404's and forward them to the error handler
app.use((_req: express.Request, _res: express.Response, next: express.NextFunction) => {
  next(createHttpError(404, 'Not Found'));
});

// Error handler
app.use(
  (error: HttpError, _req: express.Request, res: express.Response, _: express.NextFunction) => {
    res.status(error.status || 500);
    res.render('error', {
      message: error.message,
      error: process.env.NODE_ENV !== 'production' ? error : {},
    });
  },
);

const server: http.Server = http.createServer(app);
server.listen(port, () => {
  console.log(`Listening on ${config.baseURL!}`);
});
