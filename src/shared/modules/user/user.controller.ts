import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { fillDTO } from '../../helpers/common.js';
import { createJWT } from '../../helpers/jwt.js';
import { Config } from '../../libs/config/config.interface.js';
import { RestSchema } from '../../libs/config/rest.schema.js';
import {
  BaseController,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  UploadFileMiddleware,
  ValidateDtoMiddleware,
} from '../../libs/rest/index.js';
import { Component, TokenPayload } from '../../types/index.js';
import { CreateUserDto } from './create-user.dto.js';
import { LoginUserDto } from './login-user.dto.js';
import { AuthTokenRdo } from './rdo/auth-token.rdo.js';
import { UploadUserAvatarRdo } from './rdo/upload-user-avatar.rdo.js';
import { UserRdo } from './rdo/user.rdo.js';
import { UserService } from './user-service.interface.js';

const AVATAR_MIME_TYPES = ['image/jpeg', 'image/png'];

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
    this.addRoute({
      path: '/check',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
      middlewares: [new PrivateRouteMiddleware()],
    });
    this.addRoute({
      path: '/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'avatar', AVATAR_MIME_TYPES),
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

  public async login({ body }: Request<unknown, unknown, LoginUserDto>, res: Response): Promise<void> {
    const user = await this.userService.verifyUser(body.email, body.password, this.config.get('SALT'));

    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Incorrect email or password', 'UserController');
    }

    const token = await createJWT({ id: user.id, email: user.email }, this.config.get('JWT_SECRET'));

    this.ok(res, fillDTO(AuthTokenRdo, { token }));
  }

  public async checkAuthenticate({ tokenPayload }: Request, res: Response): Promise<void> {
    const user = await this.userService.findById((tokenPayload as TokenPayload).id);

    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'UserController');
    }

    this.ok(res, fillDTO(UserRdo, user));
  }

  public async uploadAvatar({ tokenPayload, file }: Request, res: Response): Promise<void> {
    if (!file) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Avatar file is required', 'UserController');
    }

    await this.userService.updateById((tokenPayload as TokenPayload).id, { avatarUrl: file.filename });

    this.created(res, fillDTO(UploadUserAvatarRdo, { avatarUrl: file.filename }));
  }
}
