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
import { Component } from '../../types/index.js';
import { fillDTO } from '../../helpers/index.js';
import { parseAsInteger } from '../../helpers/parse.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { OfferService } from './offer-service.interface.js';
import { CommentService } from '../comment/index.js';
import { CommentRdo } from '../comment/rdo/comment.rdo.js';
import { CreateOfferRequest } from './type/create-offer-request.type.js';
import { UpdateOfferRequest } from './type/update-offer-request.type.js';
import { ParamOfferId } from './type/param-offerid.type.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { OfferPreviewRdo } from './rdo/offer-preview.rdo.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { DEFAULT_OFFER_AMOUNT, DEFAULT_OFFER_IMAGES_AMOUNT } from './offer.constant.js';
import { CityService } from '../city/index.js';
import { UploadImagesRdo } from './rdo/upload-images.rdo.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.CityService) private readonly cityService: CityService,
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
        new UploadFilesMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'image', DEFAULT_OFFER_IMAGES_AMOUNT)
      ]
    });
  }

  public async index(
    { query, tokenPayload }: Request,
    res: Response
  ): Promise<void> {
    const amount = Math.max(
      parseAsInteger(query.limit) ?? 0,
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
    if (body.cityId) {
      const foundCity = await this.cityService.findByCityId(body.cityId);

      if (!foundCity) {
        throw new HttpError(
          StatusCodes.BAD_REQUEST,
          `City with id ${body.cityId} does not exist`,
          'OfferController'
        );
      }
    }

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

    const { offerId} = params;
    const fileNames = files.map((file) => file.filename);
    const updateDto = {
      imagePreview: fileNames[0],
      images: fileNames
    };
    await this.offerService.updateById(offerId, updateDto);
    this.created(res, fillDTO(UploadImagesRdo, { images: updateDto.images }));
  }
}
