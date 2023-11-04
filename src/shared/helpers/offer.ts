import {
  AmenityType,
  Coordinates,
  HousingType,
  Offer,
  User,
  UserType,
} from '../types/index.js';

function isInEnum<E extends Record<string, string>>(
  enumeration: E,
  value: string,
): value is E[keyof E] {
  return Object.values(enumeration).includes(value);
}

function parseAmenities(amenities: string): AmenityType[] {
  return amenities.split(';').map((amenity) => {
    if (isInEnum<typeof AmenityType>(AmenityType, amenity)) {
      return amenity;
    }

    throw new Error(`Amenity type ${amenity} is not supported`);
  });
}

function parseHousingType(housingType: string): HousingType {
  if (isInEnum<typeof HousingType>(HousingType, housingType)) {
    return housingType;
  }

  throw new Error(`Housing type ${housingType} is not supported`);
}

function parseUserType(type: string): UserType {
  if (isInEnum<typeof UserType>(UserType, type)) {
    return type;
  }

  throw new Error(`User type ${type} is not supported`);
}

function parseUser(
  email: string,
  name: string,
  type: string,
  avatarPath: string,
): User {
  return {
    avatarPath,
    email,
    name,
    type: parseUserType(type),
  };
}

function parseLocation(location: string): Coordinates {
  const [latitude, longitude] = location
    .split(';')
    .map((coordinate) => Number.parseFloat(coordinate));

  return { latitude, longitude };
}

export function createOffer(offerData: string): Offer {
  const [
    title,
    description,
    postDate,
    cityName,
    cityLocation,
    images,
    isPremium,
    housingType,
    roomAmount,
    guestAmount,
    price,
    amenities,
    name,
    email,
    userType,
    avatarPath,
    location,
  ] = offerData.replace('\n', '').split('\t');

  return {
    title,
    description,
    postDate: new Date(postDate),
    city: {
      name: cityName,
      location: parseLocation(cityLocation),
    },
    images: images.split(';'),
    isPremium: Boolean(isPremium),
    housingType: parseHousingType(housingType),
    roomAmount: Number.parseInt(roomAmount, 10),
    guestAmount: Number.parseInt(guestAmount, 10),
    price: Number.parseInt(price, 10),
    amenities: parseAmenities(amenities),
    author: parseUser(email, name, userType, avatarPath),
    location: parseLocation(location),
  };
}
