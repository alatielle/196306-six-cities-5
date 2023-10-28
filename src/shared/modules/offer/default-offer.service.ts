import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { DEFAULT_OFFER_AMOUNT } from './offer.constant.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { SortOrder } from '../../types/sort-order.enum.js';
import { getPipeline } from './offer.aggregation.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`📩New offer created: ${dto.title}`);

    return result;
  }

  public async find(
    currentUserId: string | undefined,
    limit = DEFAULT_OFFER_AMOUNT,
    sort: Record<string, SortOrder> = { postDate: SortOrder.Desc },
  ): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .aggregate([
        { $sort: sort },
        { $limit: limit },
        ...getPipeline(currentUserId),
      ])
      .exec();
  }

  public async findPremiumByCity(
    currentUserId: string | undefined,
    city: string,
    limit = DEFAULT_OFFER_AMOUNT,
  ): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .aggregate([
        {
          $match: {
            $and: [{ isPremium: true }, { city: city }],
          },
        },
        { $sort: { postDate: SortOrder.Desc } },
        { $limit: limit },
        ...getPipeline(currentUserId),
      ])
      .exec();
  }

  public async findById(
    currentUserId: string | undefined,
    offerId: string,
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .aggregate([
        {
          $match: {
            $expr: {
              $eq: ['$_id', { $toObjectId: offerId }],
            },
          },
        },
        ...getPipeline(currentUserId),
      ])
      .exec()
      .then(([result]) => result ?? null);
  }

  public async deleteById(
    offerId: string,
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async updateById(
    offerId: string,
    dto: UpdateOfferDto,
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }

  public async isAuthor(userId: string, documentId: string): Promise<boolean> {
    const offer = await this.offerModel.findById(documentId);
    return offer?.authorId.toString() === userId;
  }
}
