import { IsLatitude, IsLongitude } from 'class-validator';
import { CoordinatesValidationMessage } from './coordinates.messages.js';

export class CoordinatesDto {
  @IsLatitude({ message: CoordinatesValidationMessage.latitude.invalidFormat })
  public latitude: number;

  @IsLongitude({
    message: CoordinatesValidationMessage.longitude.invalidFormat,
  })
  public longitude: number;
}
