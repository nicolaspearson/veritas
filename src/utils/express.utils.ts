import { NextFunction, Request, Response } from 'express';

type ExpressFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;

/**
 * Creates a new function that passes any error to the next function.
 *
 * @param handler The original express handler that has to be safeguarded.
 * @returns The arrow function that wraps the given express handler.
 */
export function requestHandler(handler: ExpressFunction): ExpressFunction {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Using async/await and try/catch also supports handlers that are synchronous
    try {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
