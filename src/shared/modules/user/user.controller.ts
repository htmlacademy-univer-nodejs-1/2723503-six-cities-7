import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { fillDTO } from '../../helpers/common.js';
import { Config } from '../../libs/config/config.interface.js';
import { RestSchema } from '../../libs/config/rest.schema.js';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  UploadFileMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { CreateUserDto } from './create-user.dto.js';
import { LoginUserDto } from './login-user.dto.js';
import { UploadUserAvatarRdo } from './rdo/upload-user-avatar.rdo.js';
import { UserRdo } from './rdo/user.rdo.js';
import { UserService } from './user-service.interface.js';

const AVATAR_MIME_TYPES = ['image/jpeg', 'image/png'];

type ParamUserId = {
  userId: string;
};

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {
    super();

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)],
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)],
    });
    this.addRoute({ path: '/check', method: HttpMethod.Get, handler: this.checkAuthenticate });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'avatar', AVATAR_MIME_TYPES),
        new DocumentExistsMiddleware(this.userService, 'User', 'userId'),
      ],
    });
  }

  public async create({ body }: Request<unknown, unknown, CreateUserDto>, res: Response): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(StatusCodes.CONFLICT, `User with email ${body.email} already exists`, 'UserController');
    }

    const user = await this.userService.create(body, this.config.get('SALT'));

    this.created(res, fillDTO(UserRdo, user));
  }

  public async login({ body }: Request<unknown, unknown, LoginUserDto>, _res: Response): Promise<void> {
    const user = await this.userService.verifyUser(body.email, body.password, this.config.get('SALT'));

    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Incorrect email or password', 'UserController');
    }

    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Token issuing is not implemented yet', 'UserController');
  }

  public async checkAuthenticate(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Authentication check is not implemented yet', 'UserController');
  }

  public async uploadAvatar({ params, file }: Request<ParamUserId>, res: Response): Promise<void> {
    if (!file) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Avatar file is required', 'UserController');
    }

    await this.userService.updateById(params.userId, { avatarUrl: file.filename });

    this.created(res, fillDTO(UploadUserAvatarRdo, { avatarUrl: file.filename }));
  }
}
