import { IsInt, IsMongoId, IsString, Length, Max, Min } from 'class-validator';
import { RATING, TEXT_LENGTH } from '../comment.constant.js';
import { CREATE_COMMENT_MESSAGES } from './create-comment.messages.js';

export class CreateCommentDto {
  @IsString({ message: CREATE_COMMENT_MESSAGES.TEXT.INVALID_FORMAT })
  @Length(TEXT_LENGTH.MIN, TEXT_LENGTH.MAX, { message: CREATE_COMMENT_MESSAGES.TEXT.LENGTH_FIELD })
  public text: string;

  @IsInt({ message: CREATE_COMMENT_MESSAGES.RATING.INVALID_FORMAT })
  @Min(RATING.MIN, { message: CREATE_COMMENT_MESSAGES.RATING.MIN_VALUE })
  @Max(RATING.MAX, { message: CREATE_COMMENT_MESSAGES.RATING.MAX_VALUE })
  public rating: number;

  @IsMongoId({ message: CREATE_COMMENT_MESSAGES.OFFER.INVALID_ID })
  public offerId: string;

  public authorId: string;
}
