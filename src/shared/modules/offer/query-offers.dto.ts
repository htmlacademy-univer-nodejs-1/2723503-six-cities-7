import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { CITIES, CityName } from '../../types/index.js';

export class QueryLimitDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  public limit?: number;
}

export class QueryCityDto {
  @IsIn(CITIES)
  public city!: CityName;
}
