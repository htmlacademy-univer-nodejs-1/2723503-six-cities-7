import { Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { Route } from '../types/route.interface.js';
import { Controller } from './controller.interface.js';

@injectable()
export abstract class BaseController implements Controller {
  private readonly _router: Router = Router();

  public get router(): Router {
    return this._router;
  }

  public addRoute(route: Route): void {
    this._router[route.method](route.path, asyncHandler(route.handler.bind(this)));
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    res
      .type('application/json')
      .status(statusCode)
      .json(data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent(res: Response): void {
    res.status(StatusCodes.NO_CONTENT).end();
  }
}
