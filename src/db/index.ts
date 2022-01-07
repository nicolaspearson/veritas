import { Connection, createConnection, getConnection } from 'typeorm';

import { Environment } from '$/common/enums/environment.enum';
import { log } from '$/common/logger';
import { configureConnectionOptions } from '$/db/config';
import { seedDatabase } from '$/db/fixtures/seeder';

export async function init(): Promise<Connection> {
  let connection;

  try {
    connection = getConnection(process.env.TYPEORM_CONNECTION_NAME);
  } catch {
    // Ignore error
  }

  if (!connection || !connection.isConnected) {
    const options = configureConnectionOptions();
    connection = await createConnection(options);
  }

  if (process.env.NODE_ENV === Environment.Development) {
    log('Seeding database');
    await seedDatabase(connection);
  }

  return connection;
}
