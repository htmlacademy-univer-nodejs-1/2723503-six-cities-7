import { Expose } from 'class-transformer';

export class UploadUserAvatarRdo {
  @Expose()
  public avatarUrl!: string;
}
