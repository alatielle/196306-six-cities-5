import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { City, Coordinates } from '../../types/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CityEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'cities'
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CityEntity extends defaultClasses.TimeStamps implements City {
  @prop({required: true, trim: true})
  public name: string;

  @prop({ required: true, _id: false })
  public location: Coordinates;
}

export const CityModel = getModelForClass(CityEntity);
