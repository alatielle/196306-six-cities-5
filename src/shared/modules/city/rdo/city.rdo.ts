import { Expose, Type } from 'class-transformer';
import { CoordinatesRdo } from '../../coordinates/index.js';

export class CityRdo {
  @Expose()
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  @Type(() => CoordinatesRdo)
  public location: CoordinatesRdo;
}
