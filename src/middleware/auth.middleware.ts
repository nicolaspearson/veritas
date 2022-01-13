import Boom from 'boom';
import { NextFunction, Request, Response } from 'express';

import { checkJwt } from '$/index';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.oidc.isAuthenticated()) {
    // OIDC Flow
    const payload = req.oidc.user as { id: Auth0Id };
    req.auth0Id = payload.id;
    next();
  } else {
    // Jwt Flow
    checkJwt(req, res, (error: unknown) => {
      if (error || !req.auth?.payload?.sub) {
        next(Boom.unauthorized('Not authenticated.'));
      } else {
        req.auth0Id = req.auth.payload.sub as Auth0Id;
        next();
      }
    });
  }
}
