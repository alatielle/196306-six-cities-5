import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  BaseController,
  HttpMethod,
  PrivateRouteMiddleware,
  UploadFileMiddleware,
  ValidateDtoMiddleware,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { HttpError } from '../../libs/rest/index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { Component } from '../../types/index.js';
import { AuthService } from '../auth/index.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferPreviewRdo, OfferService } from '../offer/index.js';
import { UserService } from './user-service.interface.js';
import { CreateUserRequest } from './types/create-user-request.type.js';
import { LoginUserRequest } from './types/login-user-request.type.js';
import { UserRdo } from './rdo/user.rdo.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { FavoriteOfferDto } from './dto/favorite-offer.dto.js';
import { FavoriteOfferRequest } from './types/favorite-offer-request.type.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Registering routes for UserController…');

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
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkToken,
    });

    this.addRoute({
      path: '/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
        new UploadFileMiddleware(
          this.configService.get('UPLOAD_DIRECTORY'),
          'avatar',
        ),
      ],
    });

    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [new PrivateRouteMiddleware()],
    });

    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Put,
      handler: this.markAsFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(FavoriteOfferDto),
      ],
    });
  }

  public async create(
    { body, tokenPayload }: CreateUserRequest,
    res: Response,
  ): Promise<void> {
    if (tokenPayload) {
      throw new HttpError(StatusCodes.FORBIDDEN, 'Forbidden', 'UserController');
    }

    const isExistingUser = await this.userService.findByEmail(body.email);

    if (isExistingUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email "${body.email}" already exists.`,
        'UserController',
      );
    }

    const result = await this.userService.create(
      body,
      this.configService.get('SALT'),
    );
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login({ body }: LoginUserRequest, res: Response): Promise<void> {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    this.ok(res, token);
  }

  public async checkToken(
    { tokenPayload: { email } }: Request,
    res: Response,
  ): Promise<void> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController',
      );
    }

    this.ok(res, fillDTO(UserRdo, user));
  }

  public async uploadAvatar(
    { tokenPayload: { id }, file }: Request,
    res: Response,
  ) {
    const avatarPath = file?.path;

    await this.userService.updateById(id, { avatarPath });

    this.created(res, {
      filepath: avatarPath,
    });
  }

  public async getFavorites(
    { tokenPayload: { id } }: Request,
    res: Response,
  ): Promise<void> {
    const offers = await this.offerService.findFavoriteByUserId(id);
    this.ok(res, fillDTO(OfferPreviewRdo, offers));
  }

  public async markAsFavorite(
    { body, tokenPayload: { id, email } }: FavoriteOfferRequest,
    res: Response,
  ): Promise<void> {
    if (!(await this.offerService.exists(body.offerId))) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${body.offerId} not found.`,
        'UserController',
      );
    }

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new Error('User should be defined');
    }

    const favorites = new Set(user.favorites.map((offer) => offer.id));

    if (body.isFavorite) {
      favorites.add(body.offerId);
    } else {
      favorites.delete(body.offerId);
    }

    await this.userService.updateById(id, {
      favorites: [...favorites],
    });

    this.noContent(res, null);
  }
}
