import { types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto) {
    const result = await this.offerModel.create(dto);
    this.logger.info(`📩New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string) {
    return this.offerModel.findById(offerId).exec();
  }
}
