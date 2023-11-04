import { AmenityType, City, HousingType } from '../../../types/index.js';

export const UpdateOfferValidationMessage = {
  title: {
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
  },
  description: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 100000',
  },
  city: {
    invalidFormat: `city field must be one of: ${Object.values(City)}`,
  },
  housingType: {
    invalid: `housingType must be one of: ${Object.values(HousingType)}`,
  },
  premium: {
    invalidFormat: 'premium must be a boolean',
  },
  amenities: {
    invalidFormat: 'amenities must be an array',
    invalid: `Must be ${Object.values(AmenityType)}`,
  },
  guests: {
    invalidFormat: 'guestAmount must be an integer',
    minValue: 'Minimum guest amount is 1',
    maxValue: 'Maximum guest amount is 10',
  },
  rooms: {
    invalidFormat: 'roomAmount must be an integer',
    minValue: 'Minimum room amount is 1',
    maxValue: 'Maximum room amount is 8',
  },
} as const;
