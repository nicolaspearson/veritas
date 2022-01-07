import Boom from 'boom';
import { getCustomRepository } from 'typeorm';

import { LoginRequest } from '$/common/dto';
import { log } from '$/common/logger';
import { UserRepository } from '$/db/repositories/user.repository';

/**
 * Authenticates an existing user.
 *
 * @param dto The {@link LoginRequest} object.
 * @returns A JWT.
 *
 * @throws A NotFoundError if the user does not exist.
 * @throws An InternalServerError if the database transaction fails.
 */
export async function login(dto: LoginRequest): Promise<string> {
  log(`Logging in user with email: ${dto.email}`);
  const user = await getCustomRepository(UserRepository).findByEmail(dto.email);
  if (!user) {
    // This should be changed to avoid user enumeration attacks.
    throw Boom.notFound('User does not exist.');
  }
  // TODO: Authorize user in auth0
  return '';
}
