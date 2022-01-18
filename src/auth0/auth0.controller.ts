import * as express from 'express';

import { link } from '$/auth0/auth0.service';
import { PostUserRegistrationRequest } from '$/common/dto';
import { validationMiddleware } from '$/middleware/validation.middleware';
import { requestHandler } from '$/utils/express.utils';

/**
 * POST /auth0/hooks/post-registration
 *
 * Invoked by auth0 after a user has registered.
 *
 * @param req The http request.
 * @param res The http response.
 */
async function postRegister(req: express.Request, res: express.Response): Promise<void> {
  const dto = req.body as PostUserRegistrationRequest;
  await link(dto);
  res.status(200).json({});
}

/** The /auth0 routes. */
export default express.Router().post(
  '/hooks/post-registration', // TODO: Protect this endpoint with an API key
  validationMiddleware([{ dto: PostUserRegistrationRequest, location: 'body' }]),
  requestHandler(postRegister),
);
