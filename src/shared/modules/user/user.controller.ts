import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { HttpError } from '../../libs/rest/errors/index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { Component } from '../../types/index.js';
import { UserService } from './user-service.interface.js';
import { CreateUserRequest } from './create-user-request.type.js';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo } from './rdo/user.rdo.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);

    this.logger.info('Registering routes for UserController…');

    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.create });
  }

  public async create({ body }: CreateUserRequest, res: Response): Promise<void> {
    const isExistingUser = await this.userService.findByEmail(body.email);

    if (isExistingUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email "${body.email}" already exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }
}
