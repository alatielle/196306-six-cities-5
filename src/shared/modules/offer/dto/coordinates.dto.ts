import { IsLatitude, IsLongitude } from 'class-validator';
import { COORDINATES_MESSAGES } from './coordinates.messages.js';

export class CoordinatesDto {
  @IsLatitude({ message: COORDINATES_MESSAGES.LATITUDE.INVALID_FORMAT })
  public latitude: number;

  @IsLongitude({
    message: COORDINATES_MESSAGES.LONGITUDE.INVALID_FORMAT,
  })
  public longitude: number;
}
