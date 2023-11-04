import { UserType } from './types';

export class UserWithTokenDto {
  public token!: string;

  public email!: string;

  public avatarPath!: string;

  public name!: string;

  public type!: UserType;
}
