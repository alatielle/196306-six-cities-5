import { AmenityType, City, Coordinates, HousingType } from './types';

export class CreateOfferDto {
  public title!: string;

  public description!: string;

  public postDate!: string;

  public isPremium!: boolean;

  public housingType!: HousingType;

  public roomAmount!: number;

  public guestAmount!: number;

  public price!: number;

  public amenities!: AmenityType[];

  public location!: Coordinates;

  public city!: City;
}
