import { IsEmail, IsIn, IsOptional, IsString, Length, Matches } from 'class-validator';
import { USER_TYPES, UserType } from '../../types/index.js';

export class CreateUserDto {
  @IsString()
  @Length(1, 15)
  public name!: string;

  @IsEmail()
  public email!: string;

  @IsOptional()
  @IsString()
  @Matches(/\.(jpg|png)$/i)
  public avatarUrl?: string;

  @IsString()
  @Length(6, 12)
  public password!: string;

  @IsIn(USER_TYPES)
  public type!: UserType;
}
