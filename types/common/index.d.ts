type Nullable<T> = T | null;
type Opaque<K, T> = T & { type: K };

type Auth0Id = Opaque<'Auth0Id', string>;
type Email = Opaque<'Email', string>;
type Uuid = Opaque<'Uuid', string>;

declare namespace Express {
  interface Request {
    auth0Id?: Auth0Id;
  }
}
