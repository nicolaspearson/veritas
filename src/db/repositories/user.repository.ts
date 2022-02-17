import Boom from 'boom';
import {
  AbstractRepository,
  DeleteResult,
  EntityManager,
  EntityRepository,
  SelectQueryBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { User } from '$/db/entities/user.entity';

@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {
  constructor(protected readonly manager: EntityManager) {
    super();
  }

  private userQuery(): SelectQueryBuilder<User> {
    return this.manager.createQueryBuilder(User, 'user');
  }

  create(data: { auth0Id: Auth0Id; email: Email; name: string; password: string }): Promise<User> {
    const payload: QueryDeepPartialEntity<User> = {
      ...data,
    };
    return this.manager.save(User, payload as User);
  }

  deleteByAuth0Id(auth0Id: Auth0Id): Promise<DeleteResult> {
    return this.userQuery()
      .clone()
      .delete()
      .where('"user"."auth0_id" = :auth0Id', { auth0Id })
      .execute();
  }

  findByEmail(email: Email): Promise<User | undefined> {
    return this.userQuery().clone().where('"user"."email" = :email', { email }).getOne();
  }

  async findByEmailOrFail(email: Email): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw Boom.notFound(`User with email ${email} does not exist`);
    }
    return user;
  }

  findByAuth0Id(auth0Id: Auth0Id): Promise<User | undefined> {
    return this.userQuery().clone().where('"user"."auth0_id" = :auth0Id', { auth0Id }).getOne();
  }

  async findByAuth0IdOrFail(auth0Id: Auth0Id): Promise<User> {
    const user = await this.findByAuth0Id(auth0Id);
    if (!user) {
      throw Boom.notFound(`User with auth0 id: ${auth0Id} does not exist`);
    }
    return user;
  }
}
