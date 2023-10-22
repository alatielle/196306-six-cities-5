import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { SortOrder } from '../../types/sort-order.enum.js';
import { DocumentExists } from '../../types/index.js';

export interface OfferService extends DocumentExists {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  find(amount?: number, sort?: Record<string, SortOrder>): Promise<DocumentType<OfferEntity>[]>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  findPremiumByCity(city: string, amount?: number): Promise<DocumentType<OfferEntity>[]>;
  exists(documentId: string): Promise<boolean>;
  findCheap(amount: number): Promise<DocumentType<OfferEntity>[]>;
  findExpensive(amount: number): Promise<DocumentType<OfferEntity>[]>;
  findPopular(amount: number): Promise<DocumentType<OfferEntity>[]>;
  findBestRated(amount: number): Promise<DocumentType<OfferEntity>[]>;
  findFavorites(userId: string, amount?: number): Promise<DocumentType<OfferEntity>[]>;
}
