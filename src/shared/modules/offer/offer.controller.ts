import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  BaseController,
  HttpMethod,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
  HttpError,
  DocumentExistsMiddleware,
  PrivateRouteMiddleware,
  ValidateAuthorMiddleware,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { fillDTO } from '../../helpers/index.js';
import { parseAsInteger } from '../../helpers/parse.js';
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
import {
  DEFAULT_OFFER_AMOUNT,
  PREMIUM_OFFER_AMOUNT,
} from './offer.constant.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService)
    private readonly commentService: CommentService,
  ) {
    super(logger);

    this.logger.info('Registering routes for OfferController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto),
      ],
    });

    this.addRoute({
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.getPremium,
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
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
        new ValidateAuthorMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new ValidateAuthorMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
  }

  public async index(
    { query, tokenPayload }: Request,
    res: Response,
  ): Promise<void> {
    const amount = Math.max(
      parseAsInteger(query.limit) ?? 0,
      DEFAULT_OFFER_AMOUNT,
    );
    const offers = await this.offerService.find(tokenPayload?.id, amount);
    console.log(offers);
    this.ok(res, fillDTO(OfferPreviewRdo, offers));
  }

  public async create(
    { body, tokenPayload }: CreateOfferRequest,
    res: Response,
  ): Promise<void> {
    const createdOffer = await this.offerService.create({
      ...body,
      authorId: tokenPayload.id,
    });
    const offer = await this.offerService.findById(
      tokenPayload.id,
      createdOffer.id,
    );
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async show(
    { params: { offerId }, tokenPayload }: Request<ParamOfferId>,
    res: Response,
  ): Promise<void> {
    const offer = await this.offerService.findById(tokenPayload?.id, offerId);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async update(
    { params, body, tokenPayload }: UpdateOfferRequest,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;
    await this.offerService.updateById(offerId, body);
    const offer = await this.offerService.findById(tokenPayload.id, offerId);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async delete(
    { params }: Request<ParamOfferId>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;
    await this.offerService.deleteById(offerId);
    await this.commentService.deleteByOfferId(offerId);
    this.noContent(res, null);
  }

  public async getPremium(
    { query, tokenPayload }: Request,
    res: Response,
  ): Promise<void> {
    // TODO: Check in the list of cities
    // TODO: lowercase
    if (!query.city) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `${query.city} is not supported`,
        'OfferController',
      );
    }

    const offers = await this.offerService.findPremiumByCity(
      tokenPayload?.id,
      query.city as string,
      PREMIUM_OFFER_AMOUNT,
    );

    this.ok(res, fillDTO(OfferPreviewRdo, offers));
  }

  public async getComments(
    { params }: Request<ParamOfferId>,
    res: Response,
  ): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }
}
