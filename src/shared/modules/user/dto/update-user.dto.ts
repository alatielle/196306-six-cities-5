import { UserType } from '../../../types/index.js';

export class UpdateUserDto {
  public avatarPath?: string;
  public name?: string;
  public type?: UserType;
}
