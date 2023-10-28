import { Expose } from 'class-transformer';

export class CoordinatesRdo {
  @Expose()
  public latitude: number;

  @Expose()
  public longitude: number;
}
