import * as express from 'express';

declare module 'express' {
  interface Request extends express.Request {
    auth0Id?: Uuid;
  }
}
