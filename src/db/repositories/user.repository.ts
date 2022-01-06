import Boom from 'boom';
import {
  AbstractRepository,
  DeepPartial,
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

  create(data: { attributes: DeepPartial<User> }): Promise<User> {
    const payload: QueryDeepPartialEntity<User> = {
      ...data.attributes,
    };
    return this.manager.save(User, payload as User);
  }

  findByEmail(email: string): Promise<User | undefined> {
    return this.userQuery().clone().where('"user"."email" = :email', { email }).getOne();
  }

  async findByEmailOrFail(email: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw Boom.notFound(`User with email ${email} does not exist`);
    }
    return user;
  }

  findById(id: number): Promise<User | undefined> {
    return this.userQuery().clone().where('"user"."id" = :id', { id }).getOne();
  }

  async findByIdOrFail(id: number): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw Boom.notFound(`User with id ${id} does not exist`);
    }
    return user;
  }
}
