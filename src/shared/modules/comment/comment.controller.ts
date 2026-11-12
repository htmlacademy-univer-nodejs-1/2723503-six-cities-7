import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { fillDTO } from '../../helpers/common.js';
import {
  BaseController,
  HttpError,
  HttpMethod,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { OfferService } from '../offer/offer-service.interface.js';
import { CommentService } from './comment-service.interface.js';
import { CreateCommentDto } from './create-comment.dto.js';
import { CommentRdo } from './rdo/comment.rdo.js';

type ParamOfferId = {
  offerId: string;
};

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super();

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateObjectIdMiddleware('offerId'), new ValidateDtoMiddleware(CreateCommentDto)],
    });
  }

  private async checkOfferExists(offerId: string): Promise<void> {
    if (!await this.offerService.findById(offerId)) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${offerId} not found`, 'CommentController');
    }
  }

  public async index({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    await this.checkOfferExists(params.offerId);
    const comments = await this.commentService.findByOfferId(params.offerId);

    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async create({ params, body }: Request<ParamOfferId, unknown, CreateCommentDto>, res: Response): Promise<void> {
    await this.checkOfferExists(params.offerId);
    const comment = await this.commentService.create({ ...body, offerId: params.offerId });

    this.created(res, fillDTO(CommentRdo, comment));
  }
}
