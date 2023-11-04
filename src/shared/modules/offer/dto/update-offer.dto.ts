import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { AmenityType, City, HousingType } from '../../../types/index.js';
import { CoordinatesDto } from './coordinates.dto.js';
import { UPDATE_OFFER_MESSAGES } from './update-offer.messages.js';
import { DESCRIPTION_LENGTH, GUESTS, PRICE, ROOMS, TITLE_LENGTH } from '../offer.constant.js';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(TITLE_LENGTH.MIN, { message: UPDATE_OFFER_MESSAGES.TITLE.MIN_LENGTH })
  @MaxLength(TITLE_LENGTH.MAX, { message: UPDATE_OFFER_MESSAGES.TITLE.MAX_LENGTH })
  public title?: string;

  @IsOptional()
  @MinLength(DESCRIPTION_LENGTH.MIN, { message: UPDATE_OFFER_MESSAGES.DESCRIPTION.MIN_LENGTH })
  @MaxLength(DESCRIPTION_LENGTH.MAX, { message: UPDATE_OFFER_MESSAGES.DESCRIPTION.MAX_LENGTH })
  public description?: string;

  @IsOptional()
  @IsBoolean({ message: UPDATE_OFFER_MESSAGES.PREMIUM.INVALID_FORMAT })
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(HousingType, { message: UPDATE_OFFER_MESSAGES.HOUSING_TYPE.INVALID })
  public housingType?: HousingType;

  @IsOptional()
  @IsInt({ message: UPDATE_OFFER_MESSAGES.ROOMS.INVALID_FORMAT })
  @Min(ROOMS.MIN, { message: UPDATE_OFFER_MESSAGES.ROOMS.MIN_VALUE })
  @Max(ROOMS.MAX, { message: UPDATE_OFFER_MESSAGES.ROOMS.MAX_VALUE })
  public roomAmount?: number;

  @IsOptional()
  @IsInt({ message: UPDATE_OFFER_MESSAGES.GUESTS.INVALID_FORMAT })
  @Min(GUESTS.MIN, { message: UPDATE_OFFER_MESSAGES.GUESTS.MIN_VALUE })
  @Max(GUESTS.MAX, { message: UPDATE_OFFER_MESSAGES.GUESTS.MAX_VALUE })
  public guestAmount?: number;

  @IsOptional()
  @IsInt({ message: UPDATE_OFFER_MESSAGES.PRICE.INVALID_FORMAT })
  @Min(PRICE.MIN, { message: UPDATE_OFFER_MESSAGES.PRICE.MIN_VALUE })
  @Max(PRICE.MAX, { message: UPDATE_OFFER_MESSAGES.PRICE.MAX_VALUE })
  public price?: number;

  @IsOptional()
  @IsArray({ message: UPDATE_OFFER_MESSAGES.AMENITIES.INVALID_FORMAT })
  @IsEnum(AmenityType, {
    each: true,
    message: UPDATE_OFFER_MESSAGES.AMENITIES.INVALID
  })
  public amenities?: AmenityType[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  public location?: CoordinatesDto;

  @IsOptional()
  @IsEnum(City, { message: UPDATE_OFFER_MESSAGES.CITY.INVALID_FORMAT })
  public city: City;
}
