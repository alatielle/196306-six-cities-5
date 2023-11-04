import { AmenityType, City, HousingType } from '../../../types/index.js';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

import { CoordinatesDto } from './coordinates.dto.js';
import { CREATE_OFFER_MESSAGES } from './create-offer.messages.js';
import {
  DESCRIPTION_LENGTH,
  GUESTS,
  IMAGE_LENGTH,
  OFFER_IMAGES_AMOUNT,
  PRICE,
  ROOMS,
  TITLE_LENGTH
} from '../offer.constant.js';

export class CreateOfferDto {
  @MinLength(TITLE_LENGTH.MIN, { message: CREATE_OFFER_MESSAGES.TITLE.MIN_LENGTH })
  @MaxLength(TITLE_LENGTH.MAX, { message: CREATE_OFFER_MESSAGES.TITLE.MAX_LENGTH })
  public title: string;

  @MinLength(DESCRIPTION_LENGTH.MIN, { message: CREATE_OFFER_MESSAGES.DESCRIPTION.MIN_LENGTH })
  @MaxLength(DESCRIPTION_LENGTH.MAX, { message: CREATE_OFFER_MESSAGES.DESCRIPTION.MAX_LENGTH })
  public description: string;

  @IsDateString({}, { message: CREATE_OFFER_MESSAGES.POST_DATE.INVALID_FORMAT })
  public postDate: Date;

  @IsArray({ message: CREATE_OFFER_MESSAGES.IMAGES.INVALID_FORMAT })
  @MaxLength(IMAGE_LENGTH.MAX, {
    each: true,
    message: CREATE_OFFER_MESSAGES.IMAGES.MAX_LENGTH
  })
  @ArrayMinSize(OFFER_IMAGES_AMOUNT, { message: CREATE_OFFER_MESSAGES.IMAGES.INVALID_SIZE })
  @ArrayMaxSize(OFFER_IMAGES_AMOUNT, { message: CREATE_OFFER_MESSAGES.IMAGES.INVALID_SIZE })
  public images: string[];

  @IsBoolean({ message: CREATE_OFFER_MESSAGES.PREMIUM.INVALID_FORMAT })
  public isPremium: boolean;

  @IsEnum(HousingType, { message: CREATE_OFFER_MESSAGES.HOUSING_TYPE.INVALID })
  public housingType: HousingType;

  @IsInt({ message: CREATE_OFFER_MESSAGES.ROOMS.INVALID_FORMAT })
  @Min(ROOMS.MIN, { message: CREATE_OFFER_MESSAGES.ROOMS.MIN_VALUE })
  @Max(ROOMS.MAX, { message: CREATE_OFFER_MESSAGES.ROOMS.MAX_VALUE })
  public roomAmount: number;

  @IsInt({ message: CREATE_OFFER_MESSAGES.GUESTS.INVALID_FORMAT })
  @Min(GUESTS.MIN, { message: CREATE_OFFER_MESSAGES.GUESTS.MIN_VALUE })
  @Max(GUESTS.MAX, { message: CREATE_OFFER_MESSAGES.GUESTS.MAX_VALUE })
  public guestAmount: number;

  @IsInt({ message: CREATE_OFFER_MESSAGES.PRICE.INVALID_FORMAT })
  @Min(PRICE.MIN, { message: CREATE_OFFER_MESSAGES.PRICE.MIN_VALUE })
  @Max(PRICE.MAX, { message: CREATE_OFFER_MESSAGES.PRICE.MAX_VALUE })
  public price: number;

  @IsArray({ message: CREATE_OFFER_MESSAGES.AMENITIES.INVALID_FORMAT })
  @IsEnum(AmenityType, {
    each: true,
    message: CREATE_OFFER_MESSAGES.AMENITIES.INVALID
  })
  public amenities: AmenityType[];

  @ValidateNested()
  @Type(() => CoordinatesDto)
  public location: CoordinatesDto;

  public authorId: string;

  @IsEnum(City, { message: CREATE_OFFER_MESSAGES.CITY.INVALID_FORMAT })
  public city: City;
}
