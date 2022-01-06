import Boom from 'boom';
import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { ValidationError } from 'class-validator';
import { NextFunction, Request, RequestHandler, Response } from 'express';

interface DtoValidator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dto: ClassType<any>;
  location: 'body' | 'params' | 'query';
}

/**
 * Creates middleware to validate a request, it triggers a client error
 * if the request does not pass the required validation.
 *
 * @param dto the dto to validate against.
 * @param location to location of the object to validate, e.g. body / params / query.
 */
export function validationMiddleware(dtoValidators: DtoValidator[]): RequestHandler {
  return async (req: Request, _: Response, next: NextFunction) => {
    let errors: ValidationError[] | undefined;
    for (const dto of dtoValidators) {
      try {
        const result = await validate(req, dto);
        if (dto.location === 'body' && Object.keys(result).length > 0) {
          req.body = result;
        }
      } catch (error) {
        errors = error as ValidationError[];
        break;
      }
    }
    if (!errors) {
      next();
    } else {
      next(Boom.badRequest('Invalid input provided.', formatValidationErrors(errors)));
    }
  };
}

function validate(
  req: Request,
  dtoValidator: DtoValidator,
): Promise<Record<string, unknown> | Record<string, unknown>[]> {
  return transformAndValidate<Record<string, unknown>>(
    dtoValidator.dto,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    req[dtoValidator.location],
    {
      validator: { whitelist: true },
    },
  );
}

function formatValidationErrors(errors: ValidationError[], details = {}): Record<string, unknown> {
  if (errors.length > 0) {
    for (const error of errors) {
      details =
        error.children && error.children.length > 0
          ? /* istanbul ignore next */ {
              ...details,
              [error.property]: formatValidationErrors(error.children),
            }
          : {
              ...details,
              [error.property]: error.constraints,
            };
    }
  }
  return details;
}
