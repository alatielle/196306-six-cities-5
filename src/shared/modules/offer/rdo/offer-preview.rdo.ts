import { Expose, Type } from 'class-transformer';
import { HousingType } from '../../../types/index.js';
import { CityRdo } from '../../city/index.js';

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
  @Type(() => CityRdo)
  public city: CityRdo;

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
