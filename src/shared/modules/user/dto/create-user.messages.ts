export const CreateUserMessages = {
  email: {
    invalidFormat: 'email must be a valid address',
  },
  avatarPath: {
    invalidFormat: 'avatarPath is required',
  },
  name: {
    invalidFormat: 'name is required',
    lengthField: 'min length is 1, max is 15',
  },
  password: {
    invalidFormat: 'password is required',
    lengthField: 'min length for password is 6, max is 12',
  },
  type: {
    invalidFormat: 'type must be Normal or Pro',
  },
} as const;
