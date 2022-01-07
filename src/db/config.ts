import { ConnectionOptions } from 'typeorm';

import { Environment } from '$/common/enums/environment.enum';
import * as webpackConfig from '$/db/typeorm-webpack.config';

export function configureConnectionOptions(): ConnectionOptions {
  const type = 'postgres';
  const connectionOptions: ConnectionOptions = {
    type,
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT),
    name: process.env.TYPEORM_CONNECTION_NAME,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    schema: process.env.TYPEORM_SCHEMA,
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    dropSchema: process.env.TYPEORM_DROP_SCHEMA === 'true',
    entities: [process.env.TYPEORM_ENTITIES as string],
    migrations: [process.env.TYPEORM_MIGRATIONS as string],
  };

  // This option should always be set to false in the integration tests.
  if (process.env.TYPEORM_USE_WEBPACK === 'true') {
    Object.assign(connectionOptions, {
      entities: webpackConfig.entityFunctions(),
      migrations: webpackConfig.migrationFunctions(),
    } as ConnectionOptions);
  }

  if (process.env.NODE_ENV === Environment.Production) {
    // Production options that will override anything 'unsafe'
    const productionOptions: ConnectionOptions = {
      type,
      logging: ['schema', 'error'],
      synchronize: false, // Never auto create database schema
      dropSchema: false, // Never auto drop the schema in each connection
      migrationsRun: true, // Run migrations automatically with each application launch
    };
    Object.assign(connectionOptions, productionOptions);
  } else {
    // Development options that will always recreate the schema automatically and avoid migrations
    const developmentOptions: ConnectionOptions = {
      type,
      logging: ['error', 'schema', 'warn'],
      synchronize: true,
      dropSchema: true,
      migrationsRun: false,
    };
    Object.assign(connectionOptions, developmentOptions);
  }
  return connectionOptions;
}
