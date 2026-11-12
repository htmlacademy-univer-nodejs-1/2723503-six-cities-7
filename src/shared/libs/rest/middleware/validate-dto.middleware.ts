import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';

type RequestSource = 'body' | 'query';

type ValidationErrorDetail = {
  property: string;
  messages: string[];
};

function toDetails(errors: ValidationError[], parentPath = ''): ValidationErrorDetail[] {
  return errors.flatMap(({ property, constraints, children }) => {
    const path = parentPath ? `${parentPath}.${property}` : property;
    const details = constraints ? [{ property: path, messages: Object.values(constraints) }] : [];

    return [...details, ...toDetails(children ?? [], path)];
  });
}

export class ValidateDtoMiddleware implements Middleware {
  constructor(
    private readonly dto: ClassConstructor<object>,
    private readonly source: RequestSource = 'body',
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, req[this.source]);
    const errors = await validate(dtoInstance, { whitelist: true });

    if (errors.length > 0) {
      res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Validation error',
        details: toDetails(errors),
      });
      return;
    }

    req[this.source] = dtoInstance;
    next();
  }
}
