import { Connection, ObjectType } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { User } from '$/db/entities/user.entity';
import { userFixtures } from '$/db/fixtures/user.fixtures';

type Entity = ObjectType<Record<string, unknown>>;

interface Fixture {
  entity: Entity;
  values: QueryDeepPartialEntity<Entity>[];
}

const fixtures: Fixture[] = [{ entity: User, values: userFixtures }];

export async function seedDatabase(connection: Connection): Promise<void> {
  for (const fixture of fixtures) {
    const repository = connection.getRepository(fixture.entity);
    await repository.save(fixture.values);
  }
}
