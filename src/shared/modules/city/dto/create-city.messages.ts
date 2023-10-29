export const CreateCityValidationMessage = {
  name: {
    minLength: 'Minimum name length must be 1',
    maxLength: 'Maximum name length must be 20',
  },
} as const;
