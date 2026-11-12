import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { createSHA256 } from '../../helpers/hash.js';
import { Component } from '../../types/index.js';
import { CreateUserDto } from './create-user.dto.js';
import { UpdateUserDto } from './update-user.dto.js';
import { UserService } from './user-service.interface.js';
import { UserEntity } from './user.entity.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
  ) {}

  public create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    return this.userModel.create({ ...dto, password: createSHA256(dto.password, salt) });
  }

  public findById(id: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(id).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.userModel.exists({ _id: documentId })) !== null;
  }

  public findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email }).exec();
  }

  public async verifyUser(email: string, password: string, salt: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(email);

    if (!user || user.password !== createSHA256(password, salt)) {
      return null;
    }

    return user;
  }

  public updateById(id: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  public addToFavorites(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, { $addToSet: { favorites: offerId } }, { new: true })
      .exec();
  }

  public removeFromFavorites(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, { $pull: { favorites: offerId } }, { new: true })
      .exec();
  }
}
