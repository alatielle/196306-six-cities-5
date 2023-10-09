import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { AmenityType, City, HousingType } from '../../types/index.js';
import { UserEntity } from '../user/index.js';

class Coordinates {
  @prop({ required: true })
  public latitude: number;

  @prop({ required: true })
  public longitude: number;
}

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

  @prop({
    type: String,
    enum: City,
    required: true,
  })
  public city: City;

  @prop({ required: true })
  public imagePreview: string;

  @prop({ required: true, type: [String] })
  public images: string[];

  @prop({ required: true })
  public isPremium: boolean;

  @prop({ required: true })
  public isFavorite: boolean;

  @prop({ required: true })
  public rating: number;

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

  @prop({ default: 0 })
  public commentAmount: number;

  @prop({ required: true })
  public location: Coordinates;

  @prop({
    ref: UserEntity,
    required: true,
  })
  public authorId: Ref<UserEntity>;
}

export const OfferModel = getModelForClass(OfferEntity);
