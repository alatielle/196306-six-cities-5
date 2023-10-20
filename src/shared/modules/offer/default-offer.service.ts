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

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  /* Вычисление числа комментариев и среднего рейтинга */
  private commentsPipeline = [
    {
      $lookup: {
        from: 'comments',
        let: { offerId: '$_id' },
        pipeline: [{ $match: { $expr: { $eq: ['$$offerId', '$offerId'] } } }, { $project: { _id: 0, rating: 1 } }],
        as: 'comments',
      },
    },
    {
      $addFields: {
        commentAmount: { $size: '$comments' },
        rating: { $avg: '$comments.rating' },
      },
    },
    { $unset: ['comments'] },
  ];

  /* Вычисление списка пользователей, добавивших предложение в избранное */
  private favoritesPipeline = [
    {
      $lookup: {
        from: 'users',
        let: { offerId: '$_id' },
        pipeline: [{ $match: { $expr: { $in: ['$$offerId', '$favorites'] } } }, { $project: { _id: 1 } }],
        as: 'favoredByUsers',
      },
    },
  ];

  /* Вычисление автора предложения */
  private authorPipeline = [
    {
      $lookup: {
        from: 'users',
        localField: 'authorId',
        foreignField: '_id',
        as: 'authorId',
      },
    },
  ];

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`📩New offer created: ${dto.title}`);

    return result;
  }

  public async find(
    limit = DEFAULT_OFFER_AMOUNT,
    sort: Record<string, SortOrder> = { postDate: SortOrder.Desc },
  ): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .aggregate([
        ...this.commentsPipeline,
        ...this.authorPipeline,
        ...this.favoritesPipeline,
        { $limit: limit },
        { $sort: sort },
      ])
      .exec();
  }

  public async findPremiumByCity(city: string, limit = DEFAULT_OFFER_AMOUNT): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .aggregate([
        {
          $match: {
            $and: [{ isPremium: true }, { city: city }],
          },
        },
        ...this.commentsPipeline,
        ...this.authorPipeline,
        ...this.favoritesPipeline,
        { $limit: limit },
        { $sort: { postDate: SortOrder.Desc } },
      ])
      .exec();
  }

  public async findFavorites(userId: string, limit = DEFAULT_OFFER_AMOUNT): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .aggregate([
        ...this.favoritesPipeline,
        { $match: { $expr: { $in: [{ _id: { $toObjectId: userId } }, '$favoredByUsers'] } } },
        ...this.commentsPipeline,
        ...this.authorPipeline,
        { $limit: limit },
        { $sort: { postDate: SortOrder.Desc } },
      ])
      .exec();
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .aggregate([
        {
          $match: {
            $expr: {
              $eq: ['$_id', { $toObjectId: offerId }],
            },
          },
        },
        ...this.commentsPipeline,
        ...this.authorPipeline,
        ...this.favoritesPipeline,
      ])
      .exec()
      .then(([result]) => result ?? null);
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const toBeDeleted = await this.findById(offerId);
    await this.offerModel.findByIdAndDelete(offerId).exec();

    return toBeDeleted;
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    await this.offerModel.findByIdAndUpdate(offerId, dto, { new: true }).exec();

    return this.findById(offerId);
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }

  public async findCheap(limit: number): Promise<DocumentType<OfferEntity>[]> {
    return this.find(limit, { price: SortOrder.Asc });
  }

  public async findExpensive(limit: number): Promise<DocumentType<OfferEntity>[]> {
    return this.find(limit, { price: SortOrder.Desc });
  }

  public async findPopular(limit: number): Promise<DocumentType<OfferEntity>[]> {
    return this.find(limit, { commentAmount: SortOrder.Desc });
  }

  public async findBestRated(limit: number): Promise<DocumentType<OfferEntity>[]> {
    return this.find(limit, { rating: SortOrder.Desc });
  }
}
