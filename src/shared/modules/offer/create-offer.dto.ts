import { Offer } from '../../types/index.js';

export type CreateOfferDto = Omit<Offer, 'author' | 'commentsCount' | 'isFavorite'> & {
  authorId: string;
};
