export const CoordinatesValidationMessage = {
  latitude: {
    invalidFormat: 'latitude should be a number',
    minValue: 'Minimum latitude is -90',
    maxValue: 'Maximum latitude amount is 90',
  },
  longitude: {
    invalidFormat: 'longitude should be a number',
    minValue: 'Minimum longitude is -180',
    maxValue: 'Maximum longitude is 180',
  },
} as const;
