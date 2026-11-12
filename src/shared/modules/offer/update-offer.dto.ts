import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { AMENITIES, Amenity, CITIES, CityName, HOUSING_TYPES, HousingType } from '../../types/index.js';
import { CoordinatesDto } from './create-offer.dto.js';

const PHOTOS_COUNT = 6;

export class UpdateOfferDto {
  @IsOptional()
  @IsString()
  @Length(10, 100)
  public title?: string;

  @IsOptional()
  @IsString()
  @Length(20, 1024)
  public description?: string;

  @IsOptional()
  @IsDateString()
  public postDate?: Date;

  @IsOptional()
  @IsIn(CITIES)
  public city?: CityName;

  @IsOptional()
  @IsUrl()
  public previewImage?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(PHOTOS_COUNT)
  @ArrayMaxSize(PHOTOS_COUNT)
  @IsUrl({}, { each: true })
  public photos?: string[];

  @IsOptional()
  @IsBoolean()
  public isPremium?: boolean;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(1)
  @Max(5)
  public rating?: number;

  @IsOptional()
  @IsIn(HOUSING_TYPES)
  public housingType?: HousingType;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(8)
  public roomsCount?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  public guestsCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(100000)
  public price?: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsIn(AMENITIES, { each: true })
  public amenities?: Amenity[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  public coordinates?: CoordinatesDto;
}
