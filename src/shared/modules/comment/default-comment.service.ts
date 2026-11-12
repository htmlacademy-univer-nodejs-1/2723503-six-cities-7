import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Types } from 'mongoose';
import { Component } from '../../types/index.js';
import { OfferService } from '../offer/offer-service.interface.js';
import { CommentService } from './comment-service.interface.js';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './create-comment.dto.js';

const COMMENTS_LIMIT = 50;

type RatingAggregation = {
  averageRating: number;
};

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {}

  private async calculateRating(offerId: string): Promise<number> {
    const [result] = await this.commentModel.aggregate<RatingAggregation>([
      { $match: { offerId: new Types.ObjectId(offerId) } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } },
    ]).exec();

    return Math.round(result.averageRating * 10) / 10;
  }

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);

    await this.offerService.incCommentsCount(dto.offerId);
    await this.offerService.updateRating(dto.offerId, await this.calculateRating(dto.offerId));

    return comment.populate('authorId');
  }

  public findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({ offerId })
      .sort({ createdAt: -1 })
      .limit(COMMENTS_LIMIT)
      .populate('authorId')
      .exec();
  }
}
