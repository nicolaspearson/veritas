import * as express from 'express';

import { login } from '$/auth/auth.service';
import { JwtResponse, LoginRequest } from '$/common/dto';
import { log } from '$/common/logger';
import { validationMiddleware } from '$/middleware/validation.middleware';
import { requestHandler } from '$/utils/express.utils';

/**
 * POST /auth/login
 *
 * Authenticates an existing user and returns a JWT.
 *
 * @param req The http request.
 * @param res The http response.
 */
async function postLogin(req: express.Request, res: express.Response): Promise<void> {
  const dto = req.body as LoginRequest;
  const token = await login(dto);
  log(`Logged in user with email: ${dto.email} at: ${new Date().toISOString()}`);
  res.status(201).json(new JwtResponse({ token }));
}

/** The /auth routes. */
export default express
  .Router()
  .post(
    '/login',
    validationMiddleware([{ dto: LoginRequest, location: 'body' }]),
    requestHandler(postLogin),
  );
