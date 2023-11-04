import { IsBoolean } from 'class-validator';
import { FavoriteOfferMessages } from './favorite-offer.messages.js';

export class FavoriteOfferDto {
  @IsBoolean({ message: FavoriteOfferMessages.isFavorite.invalidFormat })
  public isFavorite: boolean;
}
