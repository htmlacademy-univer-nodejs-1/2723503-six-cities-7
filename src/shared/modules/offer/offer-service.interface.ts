import { DocumentType } from '@typegoose/typegoose';
import { CityName, DocumentExists } from '../../types/index.js';
import { CreateOfferDto } from './create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { UpdateOfferDto } from './update-offer.dto.js';

export interface OfferService extends DocumentExists {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(id: string): Promise<DocumentType<OfferEntity> | null>;
  find(limit?: number): Promise<DocumentType<OfferEntity>[]>;
  findPremiumByCity(city: CityName): Promise<DocumentType<OfferEntity>[]>;
  findByIds(ids: string[]): Promise<DocumentType<OfferEntity>[]>;
  updateById(id: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(id: string): Promise<DocumentType<OfferEntity> | null>;
  incCommentsCount(id: string): Promise<DocumentType<OfferEntity> | null>;
  updateRating(id: string, rating: number): Promise<DocumentType<OfferEntity> | null>;
}
