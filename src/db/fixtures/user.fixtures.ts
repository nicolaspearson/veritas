import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { User } from '$/db/entities/user.entity';

export const userFixtures: QueryDeepPartialEntity<User>[] = [
  {
    id: 1,
    email: 'msmith@fixture.example.com' as Email,
    name: 'Morty Smith',
    auth0Id: 'c0ab7d78-9147-4bd7-b313-c2bf38a6e43c' as Uuid,
  },
];
