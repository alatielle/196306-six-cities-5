import {
  getModelForClass,
  prop,
  defaultClasses,
  modelOptions,
} from '@typegoose/typegoose';
import { User, UserType } from '../../types/index.js';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  },
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ unique: true, required: true })
  public email = '';

  @prop({ required: false, default: '' })
  public avatarPath = '';

  @prop({ required: true })
  public name = '';

  @prop({ required: true })
  public password = '';

  @prop({ required: true })
  public type = UserType.Normal;
}

export const UserModel = getModelForClass(UserEntity);
