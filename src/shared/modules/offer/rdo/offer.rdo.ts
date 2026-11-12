import { Expose, Type } from 'class-transformer';
import { Amenity, CityName, HousingType } from '../../../types/index.js';
import { UserRdo } from '../../user/rdo/user.rdo.js';

class CoordinatesRdo {
  @Expose()
  public latitude!: number;

  @Expose()
  public longitude!: number;
}

export class OfferRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public postDate!: Date;

  @Expose()
  public city!: CityName;

  @Expose()
  public previewImage!: string;

  @Expose()
  public photos!: string[];

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite = false;

  @Expose()
  public rating!: number;

  @Expose()
  public housingType!: HousingType;

  @Expose()
  public roomsCount!: number;

  @Expose()
  public guestsCount!: number;

  @Expose()
  public price!: number;

  @Expose()
  public amenities!: Amenity[];

  @Expose({ name: 'authorId' })
  @Type(() => UserRdo)
  public author!: UserRdo;

  @Expose()
  public commentsCount!: number;

  @Expose()
  @Type(() => CoordinatesRdo)
  public coordinates!: CoordinatesRdo;
}
