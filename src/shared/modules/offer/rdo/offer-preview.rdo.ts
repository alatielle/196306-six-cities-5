import { Expose, Type } from 'class-transformer';
import { City, HousingType } from '../../../types/index.js';
import { CoordinatesRdo } from './coordinates.rdo.js';

export class OfferPreviewRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public housingType: HousingType;

  @Expose()
  public postDate: string;

  @Expose()
  public city: City;

  @Expose()
  @Type(() => CoordinatesRdo)
  public location: CoordinatesRdo;

  @Expose()
  public imagePreview: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public price: number;

  @Expose()
  public commentAmount: number;
}
