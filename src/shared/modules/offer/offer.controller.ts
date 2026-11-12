import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { fillDTO } from '../../helpers/common.js';
import {
  BaseController,
  HttpMethod,
  DocumentExistsMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { CityName, Component } from '../../types/index.js';
import { CreateOfferDto } from './create-offer.dto.js';
import { OfferService } from './offer-service.interface.js';
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
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto)],
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
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
  }

  public async index({ query }: Request<unknown, unknown, unknown, QueryLimit>, res: Response): Promise<void> {
    const limit = query.limit ? Number(query.limit) : undefined;
    const offers = await this.offerService.find(limit);

    this.ok(res, fillDTO(OfferPreviewRdo, offers));
  }

  public async create({ body }: Request<unknown, unknown, CreateOfferDto>, res: Response): Promise<void> {
    const offer = await this.offerService.create(body);
    const createdOffer = await this.offerService.findById(offer.id);

    this.created(res, fillDTO(OfferRdo, createdOffer));
  }

  public async getPremium({ query }: Request<unknown, unknown, unknown, QueryCity>, res: Response): Promise<void> {
    const offers = await this.offerService.findPremiumByCity(query.city as CityName);

    this.ok(res, fillDTO(OfferPreviewRdo, offers));
  }

  public async show({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async update({ params, body }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const offer = await this.offerService.updateById(params.offerId, body);

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    await this.offerService.deleteById(params.offerId);

    this.noContent(res);
  }
}
