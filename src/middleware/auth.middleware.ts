import Boom from 'boom';
import { NextFunction, Request, Response } from 'express';

export function authMiddleware(req: Request, _: Response, next: NextFunction): void {
  if (!req.oidc.isAuthenticated()) {
    throw Boom.unauthorized('Not authenticated.');
  }
  const payload = req.oidc.user as { id: Auth0Id };
  req.auth0Id = payload.id;
  next();
}
