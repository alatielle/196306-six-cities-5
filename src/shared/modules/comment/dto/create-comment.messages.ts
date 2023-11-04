import { RATING, TEXT_LENGTH } from '../comment.constant.js';

export const CREATE_COMMENT_MESSAGES = {
  TEXT: {
    INVALID_FORMAT: 'text is required',
    LENGTH_FIELD: `min length is ${TEXT_LENGTH.MIN}, max is ${TEXT_LENGTH.MAX}`
  },
  RATING: {
    INVALID_FORMAT: 'rating field must be an integer',
    MIN_VALUE: `Minimum rating is ${RATING.MIN}`,
    MAX_VALUE: `Maximum rating is ${RATING.MAX}`
  },
  OFFER: {
    INVALID_ID: 'offerId field must be a valid id',
  },
} as const;
