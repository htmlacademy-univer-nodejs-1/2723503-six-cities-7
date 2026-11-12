import { Expose } from 'class-transformer';
import { CityName, HousingType } from '../../../types/index.js';

export class OfferPreviewRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public price!: number;

  @Expose()
  public housingType!: HousingType;

  @Expose()
  public isFavorite = false;

  @Expose()
  public postDate!: Date;

  @Expose()
  public city!: CityName;

  @Expose()
  public previewImage!: string;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public commentsCount!: number;
}
