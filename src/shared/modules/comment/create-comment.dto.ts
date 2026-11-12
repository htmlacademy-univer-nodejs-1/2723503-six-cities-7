import { IsNumber, IsString, Length, Max, Min } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @Length(5, 1024)
  public text!: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  public rating!: number;

  // Определяется по токену авторизованного пользователя, а не передаётся клиентом
  public authorId!: string;

  // Берётся из параметра маршрута, а не из тела запроса
  public offerId!: string;
}
