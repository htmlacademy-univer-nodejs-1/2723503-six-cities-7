import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { CreateOfferDto } from './create-offer.dto.js';
import { OfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  public create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    return this.offerModel.create(dto);
  }

  public findById(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(id).exec();
  }
}
