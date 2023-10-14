import { Expose } from 'class-transformer';
import { AmenityType, HousingType, Coordinates } from '../../../types/index.js';
import { UserRdo } from '../../user/rdo/user.rdo.js';

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
  public location: Coordinates;

  @Expose()
  public commentAmount: number;

  @Expose()
  public author: UserRdo;
}
