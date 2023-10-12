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

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`📩New offer created: ${dto.title}`);

    return result;
  }

  public async find(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find().populate('authorId').exec();
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).populate('authorId').exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, dto, { new: true }).populate('authorId').exec();
  }

  public async findByCity(city: string, amount?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = amount ?? DEFAULT_OFFER_AMOUNT;
    return this.offerModel.find({ city }, {}, { limit }).populate('authorId').exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }

  public async incrementCommentAmount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        $inc: {
          commentAmount: 1,
        },
      })
      .exec();
  }

  public async updateAverageRating(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .aggregate([
        {
          $match: {
            $expr: {
              $eq: [
                '$_id',
                {
                  $toObjectId: offerId,
                },
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'comments',
            let: {
              offerId: '$_id',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$$offerId', '$offerId'],
                  },
                },
              },
            ],
            as: 'comments',
          },
        },
        {
          $set: {
            rating: {
              $avg: '$comments.rating',
            },
          },
        },
        {
          $unset: 'comments',
        },
      ])
      .exec()
      .then(([result]) => result ?? null);
  }

  public async findNew(limit: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find().sort({ createdAt: SortOrder.Desc }).limit(limit).populate('authorId').exec();
  }

  public async findCheap(limit: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find().sort({ price: SortOrder.Asc }).limit(limit).populate('authorId').exec();
  }

  public async findExpensive(limit: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find().sort({ price: SortOrder.Desc }).limit(limit).populate('authorId').exec();
  }

  public async findPopular(limit: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find().sort({ commentAmount: SortOrder.Desc }).limit(limit).populate('authorId').exec();
  }

  public async findBestRated(limit: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find().sort({ rating: SortOrder.Desc }).limit(limit).populate('authorId').exec();
  }
}
