import Boom from 'boom';
import { NextFunction, Request, Response } from 'express';

import { BaseError } from '$/common/errors/base.error';
import { log } from '$/common/logger';

export function errorMiddleware(
  error: BaseError,
  _res: Request,
  res: Response,
  _: NextFunction,
): void {
  log(JSON.stringify(error));
  let statusCode = error.status || 500;
  const message = error.message || 'Internal Server Error';
  if (error && error.output && error.output.statusCode) {
    statusCode = error.output.statusCode;
  }
  if (!Boom.isBoom(error)) {
    error = Boom.boomify(error, { statusCode, message });
  }
  res.status(statusCode).send({
    ...error.output.payload,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    details: error.data ?? null,
  });
}
