import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';

export interface OfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  find(): Promise<DocumentType<OfferEntity>[]>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  findByCity(city: string, limit?: number): Promise<DocumentType<OfferEntity>[]>;
  incrementCommentAmount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateAverageRating(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  exists(documentId: string): Promise<boolean>;
  findNew(limit: number): Promise<DocumentType<OfferEntity>[]>;
  findCheap(limit: number): Promise<DocumentType<OfferEntity>[]>;
  findExpensive(limit: number): Promise<DocumentType<OfferEntity>[]>;
  findPopular(limit: number): Promise<DocumentType<OfferEntity>[]>;
  findBestRated(limit: number): Promise<DocumentType<OfferEntity>[]>;
}
