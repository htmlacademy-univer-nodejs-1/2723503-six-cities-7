import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { createSHA256 } from '../../helpers/hash.js';
import { Component } from '../../types/index.js';
import { CreateUserDto } from './create-user.dto.js';
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

  public findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
