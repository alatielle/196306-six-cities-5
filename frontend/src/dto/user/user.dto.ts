import { UserType } from './types';

export class UserDto {
  public id!: string;

  public email!: string;

  public avatarPath!: string;

  public name!: string;

  public type!: UserType;
}
