import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Amenity, CityName, HousingType } from '../../types/index.js';
import { UserEntity } from '../user/user.entity.js';

class CoordinatesEntity {
  @prop({ required: true })
  public latitude!: number;

  @prop({ required: true })
  public longitude!: number;
}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  },
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ required: true })
  public title!: string;

  @prop({ required: true })
  public description!: string;

  @prop({ required: true })
  public postDate!: Date;

  @prop({ required: true, type: () => String })
  public city!: CityName;

  @prop({ required: true })
  public previewImage!: string;

  @prop({ required: true, type: () => [String] })
  public photos!: string[];

  @prop({ required: true })
  public isPremium!: boolean;

  @prop({ required: true })
  public rating!: number;

  @prop({ required: true, type: () => String })
  public housingType!: HousingType;

  @prop({ required: true })
  public roomsCount!: number;

  @prop({ required: true })
  public guestsCount!: number;

  @prop({ required: true })
  public price!: number;

  @prop({ required: true, type: () => [String] })
  public amenities!: Amenity[];

  @prop({ required: true, ref: () => UserEntity })
  public authorId!: Ref<UserEntity>;

  @prop({ default: 0 })
  public commentsCount!: number;

  @prop({ required: true, type: () => CoordinatesEntity, _id: false })
  public coordinates!: CoordinatesEntity;
}

export const OfferModel = getModelForClass(OfferEntity);
