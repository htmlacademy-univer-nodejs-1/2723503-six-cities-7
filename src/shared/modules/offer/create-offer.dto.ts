import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { AMENITIES, Amenity, CITIES, CityName, HOUSING_TYPES, HousingType } from '../../types/index.js';

const PHOTOS_COUNT = 6;

export class CoordinatesDto {
  @IsLatitude()
  public latitude!: number;

  @IsLongitude()
  public longitude!: number;
}

export class CreateOfferDto {
  @IsString()
  @Length(10, 100)
  public title!: string;

  @IsString()
  @Length(20, 1024)
  public description!: string;

  @IsDateString()
  public postDate!: Date;

  @IsIn(CITIES)
  public city!: CityName;

  @IsUrl()
  public previewImage!: string;

  @IsArray()
  @ArrayMinSize(PHOTOS_COUNT)
  @ArrayMaxSize(PHOTOS_COUNT)
  @IsUrl({}, { each: true })
  public photos!: string[];

  @IsBoolean()
  public isPremium!: boolean;

  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(1)
  @Max(5)
  public rating!: number;

  @IsIn(HOUSING_TYPES)
  public housingType!: HousingType;

  @IsInt()
  @Min(1)
  @Max(8)
  public roomsCount!: number;

  @IsInt()
  @Min(1)
  @Max(10)
  public guestsCount!: number;

  @IsNumber()
  @Min(100)
  @Max(100000)
  public price!: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsIn(AMENITIES, { each: true })
  public amenities!: Amenity[];

  // Определяется по токену авторизованного пользователя, а не передаётся клиентом
  public authorId!: string;

  @ValidateNested()
  @Type(() => CoordinatesDto)
  public coordinates!: CoordinatesDto;
}
