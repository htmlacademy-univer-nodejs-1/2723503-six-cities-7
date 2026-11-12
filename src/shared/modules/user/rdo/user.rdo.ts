import { Expose } from 'class-transformer';
import { DEFAULT_AVATAR_PATH } from '../../../constants/static.constant.js';
import { UserType } from '../../../types/index.js';

export class UserRdo {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatarUrl = DEFAULT_AVATAR_PATH;

  @Expose()
  public type!: UserType;
}
