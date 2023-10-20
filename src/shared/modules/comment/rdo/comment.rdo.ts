import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/rdo/user.rdo.js';

export class CommentRdo {
  @Expose()
  public id: string;

  @Expose()
  public text: string;

  @Expose()
  public rating: number;

  @Expose({ name: 'createdAt'})
  public postDate: string;

  @Expose({ name: 'authorId'})
  @Type(() => UserRdo)
  public author: UserRdo;
}
