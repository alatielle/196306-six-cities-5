import { getModelForClass, prop, defaultClasses, modelOptions } from '@typegoose/typegoose';

import { User, UserType } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';

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

  @prop({ required: true, default: '' })
  public name = '';

  @prop({ required: true, default: '' })
  private password?: string;

  @prop({
    type: () => String,
    enum: UserType,
    required: true,
  })
  public type: UserType;

  constructor(userData: User) {
    super();

    this.email = userData.email;
    this.avatarPath = userData.avatarPath;
    this.name = userData.name;
    this.type = userData.type;
  }

  public getPassword() {
    return this.password;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }
}

export const UserModel = getModelForClass(UserEntity);
