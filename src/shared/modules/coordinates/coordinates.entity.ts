import { prop } from '@typegoose/typegoose';

export class Coordinates {
  @prop({ required: true })
  public latitude: number;

  @prop({ required: true })
  public longitude: number;
}
