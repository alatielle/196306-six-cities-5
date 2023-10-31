import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { AmenityType, HousingType } from '../../types/index.js';
import { UserEntity } from '../user/index.js';
import { CityEntity } from '../city/index.js';
import { Coordinates } from '../coordinates/index.js';

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
  },
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true })
  public title: string;

  @prop({ trim: true, required: true })
  public description: string;

  @prop({ required: true })
  public postDate: Date;

  @prop({ required: true, type: [String] })
  public images: string[];

  @prop({ required: true })
  public isPremium: boolean;

  @prop({
    type: String,
    enum: HousingType,
    required: true,
  })
  public housingType: HousingType;

  @prop({ required: true })
  public roomAmount: number;

  @prop({ required: true })
  public guestAmount: number;

  @prop({ required: true })
  public price: number;

  @prop({
    type: [String],
    enum: AmenityType,
    required: true,
  })
  public amenities: AmenityType[];

  @prop({ required: true, _id: false })
  public location: Coordinates;

  @prop({
    ref: () => CityEntity,
    required: true,
  })
  public cityId: Ref<CityEntity>;

  @prop({
    ref: () => UserEntity,
    required: true,
  })
  public authorId: Ref<UserEntity>;
}

export const OfferModel = getModelForClass(OfferEntity);
