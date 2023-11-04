import { UserType } from './types';

export default class CreateUserDto {
  public email!: string;

  public name!: string;

  public avatarPath!: string;

  public password!: string;

  public type!: UserType;
}
