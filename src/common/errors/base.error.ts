import Boom from 'boom';

export interface BaseError extends Boom {
  status?: number;
}
