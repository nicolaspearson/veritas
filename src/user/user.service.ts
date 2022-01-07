import Boom from 'boom';
import { getCustomRepository } from 'typeorm';
import * as uuid from 'uuid';

import { RegisterUserRequest } from '$/common/dto';
import { log } from '$/common/logger';
import { User } from '$/db/entities/user.entity';
import { UserRepository } from '$/db/repositories/user.repository';

/**
 * Deletes a user's account from the database.
 *
 * @param auth0Id The auth0 {@link Uuid} of the user.
 *
 * @throws A NotFoundError if the authenticated user does not exist.
 * @throws An InternalServerError if the database transaction fails.
 */
export async function deleteUserByAuth0Id(auth0Id: Uuid): Promise<void> {
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
 * @param auth0Id The auth0 {@link Uuid} of the user.
 * @returns The {@link UserEvents} object.
 *
 * @throws A NotFoundError if the authenticated user does not exist.
 * @throws An InternalServerError if the database transaction fails.
 */
export function findUserByAuth0Id(auth0Id: Uuid): Promise<User> {
  log(`Finding user with id: ${auth0Id}`);
  return getCustomRepository(UserRepository).findByAuth0IdOrFail(auth0Id);
}

/**
 * Creates a new user entry in the database.
 *
 * @param dto The {@link RegisterUserRequest} object.
 * @returns The created {@link User} object.
 *
 * @throws A ConflictError if the user already exists.
 * @throws An InternalServerError if the database transaction fails.
 */
export async function register(dto: RegisterUserRequest): Promise<User> {
  log(`Registering user with email: ${dto.email}`);
  const user = await getCustomRepository(UserRepository).findByEmail(dto.email);
  if (user) {
    // This should be changed to avoid user enumeration attacks.
    throw Boom.conflict('User is already registered.');
  }
  // TODO: We might need to encrypt the password
  // const hashedPassword = await encryptPassword(dto.password);

  // TODO: Create user in auth0
  return getCustomRepository(UserRepository).create({ ...dto, auth0Id: uuid.v4() as Uuid });
}
