import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferService } from './offer-service.interface.js';
import { OfferPreviewRdo } from './rdo/offer-preview.rdo.js';
import { CreateOfferRequest } from './create-offer-request.type.js';
import { parseAsInteger, parseAsString } from '../../helpers/parse.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { HttpError } from '../../libs/rest/errors/index.js';
import { StatusCodes } from 'http-status-codes';
import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { UserRdo } from '../user/rdo/user.rdo.js';
import { UpdateOfferRequest } from './update-offer-request.type.js';

const DEFAULT_OFFER_AMOUNT = 60;
const PREMIUM_OFFER_AMOUNT = 3;

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Registering routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.list });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/premium', method: HttpMethod.Get, handler: this.premium });
    this.addRoute({ path: '/favorites', method: HttpMethod.Get, handler: this.favorites });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.detailed });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.update });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete });
    this.addRoute({ path: '/:offerId/favorite', method: HttpMethod.Put, handler: this.favorite });
  }

  private transformOffer(offer: DocumentType<OfferEntity>) {
    return Object.assign(offer, { isFavorite: false, rating: offer.rating ?? 0, id: offer._id.toHexString() });
  }

  public async list({ query }: Request, res: Response): Promise<void> {
    // TODO: get user id and take isFavorite from offer.favoredByUsers
    const amount = Math.max(parseAsInteger(query.limit) ?? 0, DEFAULT_OFFER_AMOUNT);
    const offers = await this.offerService
      .find(amount)
      .then((offerDocuments) => offerDocuments.map((offer) => this.transformOffer(offer)));
    const responseData = fillDTO(OfferPreviewRdo, offers);
    this.ok(res, responseData);
  }

  public async create({ body }: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.create(body);
    this.created(res, fillDTO(OfferRdo, result));
  }

  public async detailed({ params }: Request, res: Response): Promise<void> {
    const offerId = parseAsString(params.offerId);

    if (!offerId) {
      throw new HttpError(StatusCodes.BAD_REQUEST, `${params.offerId} is not a valid ID`, 'OfferController');
    }

    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${params.offerId} does not exist`, 'OfferController');
    }

    const responseData = fillDTO(OfferRdo, this.transformOffer(offer));
    responseData.author = fillDTO(UserRdo, responseData.author);
    this.ok(res, responseData);
  }

  public async update({ params, body }: UpdateOfferRequest, res: Response): Promise<void> {
    const offerId = parseAsString(params.offerId);

    if (!offerId) {
      throw new HttpError(StatusCodes.BAD_REQUEST, `${params.offerId} is not a valid ID`, 'OfferController');
    }

    const existingOffer = await this.offerService.exists(offerId);

    if (!existingOffer) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${params.offerId} does not exist`, 'OfferController');
    }

    const result = await this.offerService.updateById(offerId, body);
    this.ok(res, fillDTO(OfferRdo, result));
  }

  public async delete({ params }: Request, res: Response): Promise<void> {
    const offerId = parseAsString(params.offerId);

    if (!offerId) {
      throw new HttpError(StatusCodes.BAD_REQUEST, `${params.offerId} is not a valid ID`, 'OfferController');
    }

    const existingOffer = await this.offerService.exists(offerId);

    if (!existingOffer) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${offerId} does not exist`, 'OfferController');
    }

    await this.offerService.deleteById(offerId);
    this.noContent(res, null);
  }

  public async premium({ query }: Request, res: Response): Promise<void> {
    const city = parseAsString(query.city);

    if (!city) {
      throw new HttpError(StatusCodes.BAD_REQUEST, `${city} is not a valid city name`, 'OfferController');
    }

    const offers = await this.offerService
      .findPremiumByCity(city, PREMIUM_OFFER_AMOUNT)
      .then((offerDocuments) => offerDocuments.map((offer) => this.transformOffer(offer)));

    const responseData = fillDTO(OfferPreviewRdo, offers);
    this.ok(res, responseData);
  }

  public async favorites(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'OfferController');
  }

  public async favorite(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'OfferController');
  }
}
