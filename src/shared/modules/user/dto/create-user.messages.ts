import { UserType } from '../../../types/index.js';
import { NAME_LENGTH, PASSWORD_LENGTH } from '../user.constant.js';

export const CREATE_USER_MESSAGES = {
  EMAIL: {
    INVALID_FORMAT: 'email must be a valid address'
  },
  NAME: {
    INVALID_FORMAT: 'name is required',
    LENGTH_FIELD: `min length is ${NAME_LENGTH.MIN}, max is ${NAME_LENGTH.MAX}`
  },
  PASSWORD: {
    INVALID_FORMAT: 'password is required',
    LENGTH_FIELD: `min length is ${PASSWORD_LENGTH.MIN}, max is ${PASSWORD_LENGTH.MAX}`
  },
  TYPE: {
    INVALID_FORMAT: `type must be one of: ${Object.values(UserType)}`
  }
} as const;
