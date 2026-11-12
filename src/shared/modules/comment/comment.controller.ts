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
import { Component, TokenPayload } from '../../types/index.js';
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
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(CreateCommentDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
  }

  public async index({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);

    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async create({ params, body, tokenPayload }: Request<ParamOfferId, unknown, CreateCommentDto>, res: Response): Promise<void> {
    const comment = await this.commentService.create({
      ...body,
      authorId: (tokenPayload as TokenPayload).id,
      offerId: params.offerId,
    });

    this.created(res, fillDTO(CommentRdo, comment));
  }
}
