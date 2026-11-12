import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { fillDTO } from '../../helpers/common.js';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Component, TokenPayload } from '../../types/index.js';
import { OfferService } from '../offer/offer-service.interface.js';
import { OfferPreviewRdo } from '../offer/rdo/offer-preview.rdo.js';
import { UserService } from '../user/user-service.interface.js';

type ParamOfferId = {
  offerId: string;
};

@injectable()
export class FavoriteController extends BaseController {
  constructor(
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super();

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [new PrivateRouteMiddleware()],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
  }

  public async index({ tokenPayload }: Request, res: Response): Promise<void> {
    const user = await this.userService.findById((tokenPayload as TokenPayload).id);
    const offers = await this.offerService.findByIds(user ? user.favorites.map(String) : []);

    this.ok(res, offers.map((offer) => ({ ...fillDTO(OfferPreviewRdo, offer), isFavorite: true })));
  }

  public async create({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    await this.userService.addToFavorites((tokenPayload as TokenPayload).id, params.offerId);
    const offer = await this.offerService.findById(params.offerId);

    this.ok(res, { ...fillDTO(OfferPreviewRdo, offer), isFavorite: true });
  }

  public async delete({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    await this.userService.removeFromFavorites((tokenPayload as TokenPayload).id, params.offerId);

    this.noContent(res);
  }
}
