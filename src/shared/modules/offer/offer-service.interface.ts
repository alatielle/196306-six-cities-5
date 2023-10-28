import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { SortOrder } from '../../types/sort-order.enum.js';
import { DocumentExists } from '../../types/index.js';

export interface OfferService extends DocumentExists {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  find(
    amount?: number,
    sort?: Record<string, SortOrder>,
  ): Promise<DocumentType<OfferEntity>[]>;
  findById(offerId: string, currentUserId?: string): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(
    offerId: string,
    dto: UpdateOfferDto,
    currentUserId?: string,
  ): Promise<DocumentType<OfferEntity> | null>;
  findPremiumByCity(
    city: string,
    amount?: number,
    currentUserId?: string,
  ): Promise<DocumentType<OfferEntity>[]>;
  exists(documentId: string): Promise<boolean>;
}
