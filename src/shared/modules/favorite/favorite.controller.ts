import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';
import { BaseController, HttpError, HttpMethod, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';

const NOT_IMPLEMENTED_MESSAGE = 'Favorites require an authorized user, authentication is not implemented yet';

@injectable()
export class FavoriteController extends BaseController {
  constructor() {
    super();

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
  }

  public async index(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, NOT_IMPLEMENTED_MESSAGE, 'FavoriteController');
  }

  public async create(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, NOT_IMPLEMENTED_MESSAGE, 'FavoriteController');
  }

  public async delete(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, NOT_IMPLEMENTED_MESSAGE, 'FavoriteController');
  }
}
