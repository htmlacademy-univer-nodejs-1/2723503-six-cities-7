import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { User, UserType } from '../../types/index.js';
import type { OfferEntity } from '../offer/offer.entity.js';

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  },
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop()
  public avatarUrl?: string;

  @prop({ required: true })
  public password!: string;

  @prop({ required: true, type: () => String })
  public type!: UserType;

  // Ссылка по имени модели: offer.entity импортирует user.entity, прямой импорт класса дал бы циклическую зависимость
  @prop({ ref: 'OfferEntity', default: [] })
  public favorites!: Ref<OfferEntity>[];
}

export const UserModel = getModelForClass(UserEntity);
