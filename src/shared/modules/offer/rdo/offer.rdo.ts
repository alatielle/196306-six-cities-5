import { Expose, Type } from 'class-transformer';
import { AmenityType, HousingType } from '../../../types/index.js';
import { UserRdo } from '../../user/rdo/user.rdo.js';
import { CoordinatesRdo } from './coordinates.rdo.js';

export class OfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public postDate: string;

  @Expose()
  public city: string;

  @Expose()
  public imagePreview: string;

  @Expose()
  public images: string[];

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public housingType: HousingType;

  @Expose()
  public roomAmount: number;

  @Expose()
  public guestAmount: number;

  @Expose()
  public price: number;

  @Expose()
  public amenities: AmenityType[];

  @Expose()
  @Type(() => CoordinatesRdo)
  public location: CoordinatesRdo;

  @Expose()
  public commentAmount: number;

  @Expose({ name: 'author' })
  @Type(() => UserRdo)
  public author: UserRdo;
}
