import { UserDto } from '../user/user.dto';
import { AmenityType, City, Coordinates, HousingType } from './types';

export class OfferDto {
  public id!: string;

  public title!: string;

  public description!: string;

  public postDate!: string;

  public city!: City;

  public imagePreview!: string;

  public images!: string[];

  public isPremium!: boolean;

  public isFavorite!: boolean;

  public rating!: number;

  public housingType!: HousingType;

  public roomAmount!: number;

  public guestAmount!: number;

  public price!: number;

  public amenities!: AmenityType[];

  public location!: Coordinates;

  public commentAmount!: number;

  public author!: UserDto;
}
