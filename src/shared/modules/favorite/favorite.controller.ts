import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';
import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';

const NOT_IMPLEMENTED_MESSAGE = 'Favorites require an authorized user, authentication is not implemented yet';

@injectable()
export class FavoriteController extends BaseController {
  constructor() {
    super();

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Post, handler: this.add });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.remove });
  }

  public async index(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, NOT_IMPLEMENTED_MESSAGE, 'FavoriteController');
  }

  public async add(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, NOT_IMPLEMENTED_MESSAGE, 'FavoriteController');
  }

  public async remove(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, NOT_IMPLEMENTED_MESSAGE, 'FavoriteController');
  }
}
