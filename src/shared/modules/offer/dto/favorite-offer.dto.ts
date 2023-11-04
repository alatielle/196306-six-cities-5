import { IsBoolean } from 'class-validator';
import { FAVORITE_OFFER_MESSAGES } from './favorite-offer.messages.js';

export class FavoriteOfferDto {
  @IsBoolean({ message: FAVORITE_OFFER_MESSAGES.IS_FAVORITE.INVALID_FORMAT })
  public isFavorite: boolean;
}
