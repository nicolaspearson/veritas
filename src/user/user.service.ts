import Boom from 'boom';
import { getCustomRepository } from 'typeorm';

import { Auth0Client } from '$/auth0/client';
import { RegisterUserRequest } from '$/common/dto';
import { log } from '$/common/logger';
import { User } from '$/db/entities/user.entity';
import { UserRepository } from '$/db/repositories/user.repository';

/**
 * Deletes a user's account from the database.
 *
 * @param auth0Id The {@link Auth0Id} of the user.
 *
 * @throws A NotFoundError if the authenticated user does not exist.
 * @throws An InternalServerError if the database transaction fails.
 */
export async function deleteUserByAuth0Id(auth0Id: Auth0Id): Promise<void> {
  log(`Deleting user with auth0 id: ${auth0Id}`);
  const deleted = await getCustomRepository(UserRepository).deleteByAuth0Id(auth0Id);
  if (!deleted) {
    throw Boom.notFound(`User with auth0 id: ${auth0Id} does not exist!`);
  }
  return;
}

/**
 * Retrieves a user's profile and consent events from the database.
 *
 * @param auth0Id The {@link Auth0Id} of the user.
 * @returns The {@link UserEvents} object.
 *
 * @throws A NotFoundError if the authenticated user does not exist.
 * @throws An InternalServerError if the database transaction fails.
 */
export function findUserByAuth0Id(auth0Id: Auth0Id): Promise<User> {
  log(`Finding user with id: ${auth0Id}`);
  return getCustomRepository(UserRepository).findByAuth0IdOrFail(auth0Id);
}

/**
 * Creates a new user entry in the database.
 *
 * @param dto The {@link RegisterUserRequest} object.
 * @returns The created {@link User} object.
 *
 * @throws An InternalServerError if the database transaction fails.
 */
export async function register(dto: RegisterUserRequest): Promise<User> {
  log(`Registering user with email: ${dto.email}`);
  const user = await getCustomRepository(UserRepository).findByEmail(dto.email);
  if (user) {
    // Return the user in order to return a 201 thereby avoiding user enumeration attacks.
    return user;
  }
  let auth0Id = await Auth0Client.getInstance().getUserByEmail(dto.email);
  if (!auth0Id) {
    // Create the user in auth0
    auth0Id = await Auth0Client.getInstance().register(dto);
  }
  // These two statements should be wrapped in a transaction, to allow for rollbacks.
  // Alternatively we should determine if the user already exist in auth0, and
  // only retrieve the user's auth0Id instead of using a transaction.
  return getCustomRepository(UserRepository).create({ ...dto, auth0Id });
}
