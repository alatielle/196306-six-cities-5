import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  UploadFilesMiddleware,
  ValidateAuthorMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { Component } from '../../types/index.js';
import { fillDTO, parseAsInteger } from '../../helpers/index.js';
import { UserService } from '../user/index.js';
import { CommentService } from '../comment/index.js';
import { CommentRdo } from '../comment/rdo/comment.rdo.js';
import { OfferService } from './offer-service.interface.js';
import { CreateOfferRequest } from './type/create-offer-request.type.js';
import { UpdateOfferRequest } from './type/update-offer-request.type.js';
import { ParamOfferId } from './type/param-offerid.type.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { OfferPreviewRdo } from './rdo/offer-preview.rdo.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { DEFAULT_OFFER_AMOUNT, MAX_OFFER_AMOUNT, OFFER_IMAGES_AMOUNT, PREMIUM_OFFER_AMOUNT } from './offer.constant.js';
import { UploadImagesRdo } from './rdo/upload-images.rdo.js';
import { QueryCity } from './type/query-city.type.js';
import { FavoriteOfferDto } from './dto/favorite-offer.dto.js';
import { FavoriteOfferRequest } from './type/favorite-offer-request.type.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>
  ) {
    super(logger);

    this.logger.info('Registering routes for OfferController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto)
      ]
    });

    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [new PrivateRouteMiddleware()]
    });

    this.addRoute({
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.getPremiumOffers
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new ValidateAuthorMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new ValidateAuthorMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/:offerId/images',
      method: HttpMethod.Post,
      handler: this.uploadImages,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new ValidateAuthorMiddleware(this.offerService, 'Offer', 'offerId'),
        new UploadFilesMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'image', OFFER_IMAGES_AMOUNT)
      ]
    });

    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Put,
      handler: this.markAsFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(FavoriteOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
  }

  public async index(
    { query, tokenPayload }: Request,
    res: Response
  ): Promise<void> {
    const amount = Math.max(
      Math.min(parseAsInteger(query.limit) ?? 0, MAX_OFFER_AMOUNT),
      DEFAULT_OFFER_AMOUNT
    );
    const offers = await this.offerService.find(tokenPayload?.id, amount);
    this.ok(res, fillDTO(OfferPreviewRdo, offers));
  }

  public async create(
    { body, tokenPayload }: CreateOfferRequest,
    res: Response
  ): Promise<void> {
    const createdOffer = await this.offerService.create({
      ...body,
      authorId: tokenPayload.id
    });
    const offer = await this.offerService.findById(
      tokenPayload.id,
      createdOffer.id
    );
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async show(
    { params: { offerId }, tokenPayload }: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.findById(tokenPayload?.id, offerId);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async update(
    { params, body, tokenPayload }: UpdateOfferRequest,
    res: Response
  ): Promise<void> {
    await this.offerService.updateById(params.offerId, body);
    const offer = await this.offerService.findById(
      tokenPayload.id,
      params.offerId
    );
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async delete(
    { params }: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    await this.offerService.deleteById(offerId);
    await this.commentService.deleteByOfferId(offerId);
    this.noContent(res, null);
  }

  public async getComments(
    { params }: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async uploadImages({ params, files }: Request<ParamOfferId>, res: Response) {
    if (!Array.isArray(files)) {
      throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'No files were uploaded');
    }

    const { offerId } = params;
    const fileNames = files.map((file) => file.filename);
    const updateDto = {
      images: fileNames
    };
    await this.offerService.updateById(offerId, updateDto);
    this.created(res, fillDTO(UploadImagesRdo, updateDto));
  }

  public async getPremiumOffers(
    { query, tokenPayload }: Request<unknown, unknown, unknown, QueryCity>,
    res: Response
  ): Promise<void> {
    const offers = await this.offerService.findPremiumByCity(
      tokenPayload?.id,
      query.city as string,
      PREMIUM_OFFER_AMOUNT
    );

    this.ok(res, fillDTO(OfferPreviewRdo, offers));
  }

  public async getFavorites(
    { tokenPayload: { id } }: Request,
    res: Response
  ): Promise<void> {
    const offers = await this.offerService.findFavoriteByUserId(id);
    this.ok(res, fillDTO(OfferPreviewRdo, offers));
  }

  public async markAsFavorite(
    { body, params, tokenPayload: { id, email } }: FavoriteOfferRequest,
    res: Response
  ): Promise<void> {
    const user = await this.userService.findByEmail(email);
    const favorites = new Set(user!.favorites.map((offer) => offer.id));

    if (body.isFavorite) {
      favorites.add(params.offerId);
    } else {
      favorites.delete(params.offerId);
    }

    await this.userService.updateById(id, {
      favorites: [...favorites]
    });

    this.noContent(res, null);
  }
}
