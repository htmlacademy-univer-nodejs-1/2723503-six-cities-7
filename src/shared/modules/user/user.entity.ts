import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { User, UserType } from '../../types/index.js';

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
}

export const UserModel = getModelForClass(UserEntity);
