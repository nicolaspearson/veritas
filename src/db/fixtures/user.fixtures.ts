import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { User } from '$/db/entities/user.entity';

export const userFixtures: QueryDeepPartialEntity<User>[] = [
  {
    id: 'c0ab7d78-9147-4bd7-b313-c2bf38a6e43c' as Uuid,
    email: 'msmith@fixture.example.com' as Email,
    name: 'Morty Smith',
    auth0Id: 'auth0|61d80523f995f80069e23b57' as Auth0Id,
  },
];
