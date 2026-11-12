import { ClassConstructor, plainToInstance } from 'class-transformer';

export function fillDTO<T, V>(dto: ClassConstructor<T>, plainObject: V): T {
  return plainToInstance(dto, plainObject, { excludeExtraneousValues: true, exposeDefaultValues: true });
}
