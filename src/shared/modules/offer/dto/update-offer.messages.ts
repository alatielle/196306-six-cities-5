import { AmenityType, City, HousingType } from '../../../types/index.js';
import { DESCRIPTION_LENGTH, GUESTS, PRICE, ROOMS, TITLE_LENGTH } from '../offer.constant.js';

export const UPDATE_OFFER_MESSAGES = {
  TITLE: {
    MIN_LENGTH: `Minimum title length must be ${TITLE_LENGTH.MIN}`,
    MAX_LENGTH: `Maximum title length must be ${TITLE_LENGTH.MAX}`,
  },
  DESCRIPTION: {
    MIN_LENGTH: `Minimum description length must be ${DESCRIPTION_LENGTH.MIN}`,
    MAX_LENGTH: `Maximum description length must be ${DESCRIPTION_LENGTH.MAX}`,
  },
  PRICE: {
    INVALID_FORMAT: 'Price must be an integer',
    MIN_VALUE: `Minimum price is ${PRICE.MIN}`,
    MAX_VALUE: `Maximum price is ${PRICE.MAX}`,
  },
  CITY: {
    INVALID_FORMAT: `city field must be one of: ${Object.values(City)}`,
  },
  HOUSING_TYPE: {
    INVALID: `housingType must be one of: ${Object.values(HousingType)}`,
  },
  PREMIUM: {
    INVALID_FORMAT: 'premium must be a boolean',
  },
  AMENITIES: {
    INVALID_FORMAT: 'amenities must be an array',
    INVALID: `Must be ${Object.values(AmenityType)}`,
  },
  GUESTS: {
    INVALID_FORMAT: 'guestAmount must be an integer',
    MIN_VALUE: `Minimum guest amount is ${GUESTS.MIN}`,
    MAX_VALUE: `Maximum guest amount is ${GUESTS.MAX}`,
  },
  ROOMS: {
    INVALID_FORMAT: 'roomAmount must be an integer',
    MIN_VALUE: `Minimum room amount is ${ROOMS.MIN}`,
    MAX_VALUE: `Maximum room amount is ${ROOMS.MAX}`,
  },
} as const;
