import Boom from 'boom';
import { getCustomRepository } from 'typeorm';

import { Auth0Client } from '$/auth0/client';
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
export async function login(dto: LoginRequest, ipAddress: string): Promise<string> {
  log(`Logging in user with email: ${dto.email}`);
  const user = await getCustomRepository(UserRepository).findByEmail(dto.email);
  if (!user) {
    // Throw a 404 to avoid user enumeration attacks.
    throw Boom.notFound('Invalid email address or password provided.');
  }
  return Auth0Client.getInstance().signIn(dto, ipAddress);
}
