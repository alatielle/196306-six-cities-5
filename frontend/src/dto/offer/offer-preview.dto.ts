import { City, HousingType } from './types';

export class OfferPreviewDto {
  public id!: string;

  public title!: string;

  public postDate!: string;

  public city!: City;

  public imagePreview!: string;

  public isPremium!: boolean;

  public isFavorite!: boolean;

  public rating!: number;

  public housingType!: HousingType;

  public price!: number;

  public commentAmount!: number;
}
