import { MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CoordinatesDto } from '../../coordinates/index.js';
import { CreateCityValidationMessage } from './create-city.messages.js';

export class CreateCityDto {
  @MinLength(1, { message: CreateCityValidationMessage.name.minLength })
  @MaxLength(20, { message: CreateCityValidationMessage.name.maxLength })
  public name: string;

  @ValidateNested()
  @Type(() => CoordinatesDto)
  public location: CoordinatesDto;
}
