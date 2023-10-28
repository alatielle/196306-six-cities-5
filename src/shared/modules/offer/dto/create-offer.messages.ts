export const CreateOfferValidationMessage = {
  title: {
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
  },
  description: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  postDate: {
    invalidFormat: 'postDate must be a valid ISO date',
  },
  image: {
    maxLength: 'Too short for field «image»',
  },
  images: {
    invalidFormat: 'images must be an array',
    maxLength: 'Too short for field «images»',
    invalidSize: 'Should always be 6 images',
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 100000',
  },
  city: {
    invalid:
      'city must be one of: Paris, Cologne, Brussels, Amsterdam, Hamburg, Dusseldorf',
  },
  housingType: {
    invalid: 'housingType must be one of: apartment, house, room, hotel',
  },
  premium: {
    invalidFormat: 'premium must be a boolean',
  },
  amenities: {
    invalidFormat: 'amenities must be an array',
    invalid:
      'Must be Breakfast, Air conditioning, Laptop friendly workspace, Baby seat, Washer, Towels, Fridge',
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
