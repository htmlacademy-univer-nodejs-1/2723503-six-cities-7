import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Component } from '../../../types/index.js';
import { Logger } from '../../logger/logger.interface.js';
import { HttpError } from '../errors/http-error.js';
import { ExceptionFilter } from './exception-filter.interface.js';

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
  ) {}

  private handleHttpError(error: HttpError, res: Response): void {
    this.logger.error(`[${error.detail ?? 'HttpError'}]: ${error.httpStatusCode} — ${error.message}`, error);
    res.status(error.httpStatusCode).json({ error: error.message });
  }

  private handleServerError(error: Error, res: Response): void {
    this.logger.error(error.message, error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }

  public catch(error: Error, _req: Request, res: Response, _next: NextFunction): void {
    if (error instanceof HttpError) {
      return this.handleHttpError(error, res);
    }

    this.handleServerError(error, res);
  }
}
