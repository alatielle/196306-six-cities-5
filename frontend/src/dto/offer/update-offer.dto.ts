import { HousingType, AmenityType, City, Coordinates } from './types';

export class UpdateOfferDto {
  public title?: string;

  public description?: string;

  public isPremium?: boolean;

  public housingType?: HousingType;

  public roomAmount?: number;

  public guestAmount?: number;

  public price?: number;

  public amenities?: AmenityType[];

  public location?: Coordinates;

  public city?: City;
}
