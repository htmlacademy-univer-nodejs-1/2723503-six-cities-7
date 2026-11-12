import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { CityName, Component } from '../../types/index.js';
import { CommentEntity } from '../comment/comment.entity.js';
import { CreateOfferDto } from './create-offer.dto.js';
import { OfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { UpdateOfferDto } from './update-offer.dto.js';

const DEFAULT_OFFERS_LIMIT = 60;
const PREMIUM_OFFERS_LIMIT = 3;

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
  ) {}

  public create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    return this.offerModel.create(dto);
  }

  public findById(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(id).populate('authorId').exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }

  public find(limit = DEFAULT_OFFERS_LIMIT): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find()
      .sort({ postDate: -1 })
      .limit(limit)
      .exec();
  }

  public findPremiumByCity(city: CityName): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ city, isPremium: true })
      .sort({ postDate: -1 })
      .limit(PREMIUM_OFFERS_LIMIT)
      .exec();
  }

  public findByIds(ids: string[]): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ _id: { $in: ids } })
      .exec();
  }

  public updateById(id: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('authorId')
      .exec();
  }

  public async deleteById(id: string): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel.findByIdAndDelete(id).exec();

    if (offer) {
      await this.commentModel.deleteMany({ offerId: id }).exec();
    }

    return offer;
  }

  public incCommentsCount(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(id, { $inc: { commentsCount: 1 } }, { new: true })
      .exec();
  }

  public updateRating(id: string, rating: number): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(id, { rating }, { new: true })
      .exec();
  }
}
