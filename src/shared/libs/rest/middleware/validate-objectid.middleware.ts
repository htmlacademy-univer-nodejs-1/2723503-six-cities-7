import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { HttpError } from '../errors/http-error.js';
import { Middleware } from './middleware.interface.js';

export class ValidateObjectIdMiddleware implements Middleware {
  constructor(private readonly param: string) {}

  public execute({ params }: Request, _res: Response, next: NextFunction): void {
    const objectId = params[this.param];

    if (!Types.ObjectId.isValid(objectId)) {
      throw new HttpError(StatusCodes.BAD_REQUEST, `${objectId} is invalid ObjectID`, 'ValidateObjectIdMiddleware');
    }

    next();
  }
}
