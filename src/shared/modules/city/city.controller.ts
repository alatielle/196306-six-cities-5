import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController,
  HttpMethod,
  ValidateObjectIdMiddleware,
  DocumentExistsMiddleware,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferPreviewRdo, OfferService } from '../offer/index.js';
import { CityService } from './city-service.interface.js';
import { PREMIUM_OFFER_AMOUNT } from './city.constant.js';
import { ParamCityId } from './type/param-cityid.type.js';

@injectable()
export class CityController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CityService) private readonly cityService: CityService,
  ) {
    super(logger);

    this.logger.info('Registering routes for CityController…');

    this.addRoute({
      path: '/:cityId/premium',
      method: HttpMethod.Get,
      handler: this.getPremiumOffers,
      middlewares: [
        new ValidateObjectIdMiddleware('cityId'),
        new DocumentExistsMiddleware(this.cityService, 'City', 'cityId'),
      ],
    });
  }

  public async getPremiumOffers(
    { params, tokenPayload }: Request<ParamCityId>,
    res: Response,
  ): Promise<void> {
    const offers = await this.offerService.findPremiumByCityId(
      tokenPayload?.id,
      params.cityId,
      PREMIUM_OFFER_AMOUNT,
    );

    this.ok(res, fillDTO(OfferPreviewRdo, offers));
  }
}
