import { IsBoolean, IsMongoId } from 'class-validator';
import { FavoriteOfferMessages } from './favorite-offer.messages.js';

export class FavoriteOfferDto {
  @IsMongoId({ message: FavoriteOfferMessages.offerId.invalidId })
  public offerId: string;

  @IsBoolean({ message: FavoriteOfferMessages.isFavorite.invalidFormat })
  public isFavorite: boolean;
}
