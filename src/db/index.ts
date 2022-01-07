import { Connection, createConnection } from 'typeorm';

import { Environment } from '$/common/enums/environment.enum';
import { log } from '$/common/logger';
import { configureConnectionOptions } from '$/db/config';
import { seedDatabase } from '$/db/fixtures/seeder';

export async function init(): Promise<Connection> {
  const options = configureConnectionOptions();
  const connection = await createConnection(options);
  if (process.env.NODE_ENV === Environment.Development) {
    log('Seeding database');
    await seedDatabase(connection);
  }
  return connection;
}
