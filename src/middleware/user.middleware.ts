import { NextFunction, Request, Response } from 'express';

export function userMiddleware(req: Request, res: Response, next: NextFunction): void {
  res.locals.user = req.oidc.user;
  next();
}
