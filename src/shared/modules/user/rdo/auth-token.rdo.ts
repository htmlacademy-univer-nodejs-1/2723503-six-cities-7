import { Expose } from 'class-transformer';

export class AuthTokenRdo {
  @Expose()
  public token!: string;
}
