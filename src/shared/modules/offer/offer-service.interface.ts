import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { UpdateOfferImagesDto } from './dto/update-offer-images.dto.js';
import { DocumentExists, IsDocumentAuthor, SortOrder } from '../../types/index.js';

export interface OfferService extends DocumentExists, IsDocumentAuthor {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;

  find(
    currentUserId: string | undefined,
    amount?: number,
    sort?: Record<string, SortOrder>
  ): Promise<DocumentType<OfferEntity>[]>;

  findById(
    currentUserId: string | undefined,
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null>;

  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  updateById(
    offerId: string,
    dto: UpdateOfferDto | UpdateOfferImagesDto
  ): Promise<DocumentType<OfferEntity> | null>;

  findPremiumByCity(
    currentUserId: string | undefined,
    city: string,
    amount?: number
  ): Promise<DocumentType<OfferEntity>[]>;

  findFavoriteByUserId(userId: string): Promise<DocumentType<OfferEntity>[]>;
}
