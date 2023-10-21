import { IsNumber, Max, Min } from 'class-validator';
import { CoordinatesValidationMessage } from './coordinates.messages.js';

export class CoordinatesDto {
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: CoordinatesValidationMessage.latitude.invalidFormat })
  @Min(-90, { message: CoordinatesValidationMessage.latitude.minValue })
  @Max(90, { message: CoordinatesValidationMessage.latitude.maxValue })
  public latitude: number;

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: CoordinatesValidationMessage.longitude.invalidFormat },
  )
  @Min(-180, { message: CoordinatesValidationMessage.longitude.minValue })
  @Max(180, { message: CoordinatesValidationMessage.longitude.maxValue })
  public longitude: number;
}
