import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { fillDTO } from '../../helpers/common.js';
import { Config } from '../../libs/config/config.interface.js';
import { RestSchema } from '../../libs/config/rest.schema.js';
import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { CreateUserDto } from './create-user.dto.js';
import { LoginUserDto } from './login-user.dto.js';
import { UserRdo } from './rdo/user.rdo.js';
import { UserService } from './user-service.interface.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {
    super();

    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login });
    this.addRoute({ path: '/check', method: HttpMethod.Get, handler: this.checkAuthenticate });
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
}
