import * as express from 'express';

import { RegisterUserRequest, UserProfileResponse, UserRegistrationResponse } from '$/common/dto';
import { log } from '$/common/logger';
import { authMiddleware } from '$/middleware/auth.middleware';
import { validationMiddleware } from '$/middleware/validation.middleware';
import { deleteUserByAuth0Id, findUserByAuth0Id, register } from '$/user/user.service';
import { requestHandler } from '$/utils/express.utils';

/**
 * DELETE /user
 *
 * Deletes the account of the authenticated user.
 *
 * @param req The http request.
 * @param res The http response.
 */
async function deleteAuthenticatedUser(req: express.Request, res: express.Response): Promise<void> {
  const auth0Id = req.auth0Id!;
  await deleteUserByAuth0Id(auth0Id);
  log(`Deleted user with auth0 id: ${auth0Id}`);
  res.status(204).json({});
}

/**
 * GET /user
 *
 * Returns the authenticated user's profile.
 *
 * @param req The http request.
 * @param res The http response.
 */
async function getAuthenticatedUser(req: express.Request, res: express.Response): Promise<void> {
  const auth0Id = req.auth0Id!;
  const user = await findUserByAuth0Id(auth0Id);
  log(`Found user with auth0 id: ${auth0Id} created at: ${user.createdAt.toISOString()}`);
  res.status(200).json(new UserProfileResponse(user));
}

/**
 * POST /users/registration
 *
 * Registers a new user, if the user already exists a 400 will be returned to avoid
 * user enumeration attacks, however we are still vulnerable to a timing attack which
 * is out of scope for the moment.
 *
 * @param req The http request.
 * @param res The http response.
 */
async function postRegister(req: express.Request, res: express.Response): Promise<void> {
  const dto = req.body as RegisterUserRequest;
  const user = await register(dto);
  const userId = user.id;
  log(`Created user with id: ${userId} at: ${user.createdAt.toISOString()}`);
  res.status(201).json(new UserRegistrationResponse(user));
}

/** The /user & /users routes. */
export default express
  .Router()
  .delete('/user', authMiddleware, requestHandler(deleteAuthenticatedUser))
  .get('/user', authMiddleware, requestHandler(getAuthenticatedUser))
  .post(
    '/users/registration',
    validationMiddleware([{ dto: RegisterUserRequest, location: 'body' }]),
    requestHandler(postRegister),
  );
