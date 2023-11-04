import { UserDto } from '../user/user.dto';

export class CommentDto {
  public id!: string;

  public text!: string;

  public rating!: number;

  public postDate!: string;

  public author!: UserDto;
}
