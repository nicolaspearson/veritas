import { Auth0Client } from '$/auth0/client';
import { PostUserRegistrationRequest } from '$/common/dto';
import { log } from '$/common/logger';

/**
 * Links multiple user accounts in auth0.
 *
 * @param dto The {@link PostUserRegistrationRequest} object.
 *
 * @throws An InternalServerError if the request fails.
 */
export async function link(dto: PostUserRegistrationRequest): Promise<void> {
  log(`Post user registration hook invoked for user with email: ${dto.email}`);
  const users = await Auth0Client.getInstance().getUsersByEmail(dto.email);
  if (users.length > 0) {
    log(`Found users: [${users.map((u) => u.email!).join(', ')}]`);
    const auth0Id = users.splice(0, 1)[0].user_id! as Auth0Id;
    for (const user of users) {
      if (user.user_id && user.identities && user.identities.length > 0) {
        log(`Linking users: ${auth0Id} and ${user.user_id}`);
        await Auth0Client.getInstance().linkAccounts(auth0Id, user.identities);
      }
    }
  }
}
