/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ConnectionOptions } from 'typeorm';

export type WebpackConnectionOptions = Pick<ConnectionOptions, 'entities' | 'migrations'>;

/**
 * This required because we supply TypeORM with our entities and migrations on start-up. This can
 * either be supplied as a path to a location where TypeORM is able to locate the compiled classes
 * and functions, e.g. dist/db/entities/*.js, or we can supply the entities one-by-one in the
 * connection configuration, both options have their downsides. It is not ideal to supply a path
 * because we are compiling a single bundle, and we do not want to supply each entity and migration
 * in the connection configuration because this soon becomes unmanageable as the size of the package
 * grows.
 *
 * Webpack gives us require.context, which allows us to get all matching modules from a given
 * directory. This means we can get all of our entities and migrations automatically, and supply
 * this to TypeORM in the connection configuration instead.
 *
 * https://spin.atomicobject.com/2020/12/21/typeorm-webpack/
 * https://webpack.js.org/guides/dependency-management/#requirecontext
 */
function importFunctions(requireContext: __WebpackModuleApi.RequireContext) {
  return requireContext
    .keys()
    .sort()
    .flatMap((filename) => {
      const required = requireContext(filename);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, unicorn/no-array-reduce
      return Object.keys(required).reduce((result, exportedKey) => {
        const exported = required[exportedKey];
        if (typeof exported === 'function') {
          return [...result, ...(Array.isArray(exported) ? exported : [exported])];
        }
        return result;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }, [] as any);
    });
}

export function entityFunctions(): NonNullable<WebpackConnectionOptions['entities']> {
  return importFunctions(require.context('./entities/', true, /\.ts$/));
}

export function migrationFunctions(): NonNullable<WebpackConnectionOptions['migrations']> {
  return importFunctions(require.context('./migrations/', true, /\.ts$/));
}
