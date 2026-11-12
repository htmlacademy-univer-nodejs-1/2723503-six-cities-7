import { DocumentType } from '@typegoose/typegoose';
import { CreateUserDto } from './create-user.dto.js';
import { UpdateUserDto } from './update-user.dto.js';
import { UserEntity } from './user.entity.js';

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findById(id: string): Promise<DocumentType<UserEntity> | null>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  verifyUser(email: string, password: string, salt: string): Promise<DocumentType<UserEntity> | null>;
  updateById(id: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null>;
  addToFavorites(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null>;
  removeFromFavorites(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null>;
}
