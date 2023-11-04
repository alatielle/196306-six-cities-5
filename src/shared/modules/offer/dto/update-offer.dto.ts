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
import { CoordinatesDto } from '../../coordinates/index.js';
import { UpdateOfferValidationMessage } from './update-offer.messages.js';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(10, { message: UpdateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: UpdateOfferValidationMessage.title.maxLength })
  public title?: string;

  @IsOptional()
  @MinLength(20, {
    message: UpdateOfferValidationMessage.description.minLength,
  })
  @MaxLength(1024, {
    message: UpdateOfferValidationMessage.description.maxLength,
  })
  public description?: string;

  @IsOptional()
  @IsBoolean({ message: UpdateOfferValidationMessage.premium.invalidFormat })
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(HousingType, {
    message: UpdateOfferValidationMessage.housingType.invalid,
  })
  public housingType?: HousingType;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.rooms.invalidFormat })
  @Min(1, { message: UpdateOfferValidationMessage.rooms.minValue })
  @Max(8, { message: UpdateOfferValidationMessage.rooms.maxValue })
  public roomAmount?: number;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.guests.invalidFormat })
  @Min(1, { message: UpdateOfferValidationMessage.guests.minValue })
  @Max(10, { message: UpdateOfferValidationMessage.guests.maxValue })
  public guestAmount?: number;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: UpdateOfferValidationMessage.price.minValue })
  @Max(100000, { message: UpdateOfferValidationMessage.price.maxValue })
  public price?: number;

  @IsOptional()
  @IsArray({ message: UpdateOfferValidationMessage.amenities.invalidFormat })
  @IsEnum(AmenityType, {
    each: true,
    message: UpdateOfferValidationMessage.amenities.invalid,
  })
  public amenities?: AmenityType[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  public location?: CoordinatesDto;

  @IsEnum(City, {
    message: UpdateOfferValidationMessage.city.invalidFormat
  })
  public city: City;
}
