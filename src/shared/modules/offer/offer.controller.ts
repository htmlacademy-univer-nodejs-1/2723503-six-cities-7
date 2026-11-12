import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { fillDTO } from '../../helpers/common.js';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { CityName, Component, TokenPayload } from '../../types/index.js';
import { UserService } from '../user/user-service.interface.js';
import { CreateOfferDto } from './create-offer.dto.js';
import { OfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { QueryCityDto, QueryLimitDto } from './query-offers.dto.js';
import { OfferPreviewRdo } from './rdo/offer-preview.rdo.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { UpdateOfferDto } from './update-offer.dto.js';

type ParamOfferId = {
  offerId: string;
};

type QueryLimit = {
  limit?: string;
};

type QueryCity = {
  city?: CityName;
};

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super();

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [new ValidateDtoMiddleware(QueryLimitDto, 'query')],
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new PrivateRouteMiddleware(), new ValidateDtoMiddleware(CreateOfferDto)],
    });
    this.addRoute({
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.getPremium,
      middlewares: [new ValidateDtoMiddleware(QueryCityDto, 'query')],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
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

  private async getFavoriteIds(tokenPayload?: TokenPayload): Promise<string[]> {
    if (!tokenPayload) {
      return [];
    }

    const user = await this.userService.findById(tokenPayload.id);

    return user ? user.favorites.map(String) : [];
  }

  private toOfferRdo(offer: OfferEntity | null, favoriteIds: string[]): OfferRdo {
    const rdo = fillDTO(OfferRdo, offer);
    rdo.isFavorite = favoriteIds.includes(rdo.id);

    return rdo;
  }

  private toOfferPreviewRdos(offers: OfferEntity[], favoriteIds: string[]): OfferPreviewRdo[] {
    return offers.map((offer) => {
      const rdo = fillDTO(OfferPreviewRdo, offer);
      rdo.isFavorite = favoriteIds.includes(rdo.id);

      return rdo;
    });
  }

  public async index({ query, tokenPayload }: Request<unknown, unknown, unknown, QueryLimit>, res: Response): Promise<void> {
    const limit = query.limit ? Number(query.limit) : undefined;
    const offers = await this.offerService.find(limit);

    this.ok(res, this.toOfferPreviewRdos(offers, await this.getFavoriteIds(tokenPayload)));
  }

  public async create({ body, tokenPayload }: Request<unknown, unknown, CreateOfferDto>, res: Response): Promise<void> {
    const offer = await this.offerService.create({ ...body, authorId: (tokenPayload as TokenPayload).id });
    const createdOffer = await this.offerService.findById(offer.id);

    this.created(res, fillDTO(OfferRdo, createdOffer));
  }

  public async getPremium({ query, tokenPayload }: Request<unknown, unknown, unknown, QueryCity>, res: Response): Promise<void> {
    const offers = await this.offerService.findPremiumByCity(query.city as CityName);

    this.ok(res, this.toOfferPreviewRdos(offers, await this.getFavoriteIds(tokenPayload)));
  }

  public async show({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);

    this.ok(res, this.toOfferRdo(offer, await this.getFavoriteIds(tokenPayload)));
  }

  public async update({ params, body, tokenPayload }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const offer = await this.offerService.updateById(params.offerId, body);

    this.ok(res, this.toOfferRdo(offer, await this.getFavoriteIds(tokenPayload)));
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    await this.offerService.deleteById(params.offerId);

    this.noContent(res);
  }
}
