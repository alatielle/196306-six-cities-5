import chalk from 'chalk';
import { Command } from './command.interface.js';
import { Offer } from '../../shared/types/offer.type.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { AmenityType, City, Coordinates } from '../../shared/types/index.js';
import { HousingType } from '../../shared/types/housing-type.enum.js';
import { UserType } from '../../shared/types/user-type.enum.js';
import { User } from '../../shared/types/user.type.js';

function isInEnum<E extends Record<string, string>>(
  enumeration: E,
  value: string,
): value is E[keyof E] {
  return Object.values(enumeration).indexOf(value) !== -1;
}

function parseAmenities(amenities: string): AmenityType[] {
  return amenities.split(';').map((amenity) => {
    if (isInEnum<typeof AmenityType>(AmenityType, amenity)) {
      return amenity;
    }

    throw new Error(`Amenity type ${amenity} is not supported`);
  });
}

function parseCity(city: string): City {
  if (isInEnum<typeof City>(City, city)) {
    return city;
  }

  throw new Error(`City ${city} is not supported`);
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
  password: string,
): User {
  return {
    avatarPath,
    email,
    name,
    password,
    type: parseUserType(type),
  };
}

function parseLocation(location: string): Coordinates {
  const [latitude, longitude] = location
    .split(';')
    .map((coordinate) => Number.parseFloat(coordinate));

  return { latitude, longitude };
}

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public run(...parameters: string[]): void {
    if (!parameters.length) {
      console.error(chalk.red('No filename to import from'));
      return;
    }

    const [filename] = parameters;
    const fileReader = new TSVFileReader<Offer>(
      filename.trim(),
      ([
        title,
        description,
        postDate,
        city,
        imagePreview,
        images,
        isPremium,
        isFavorite,
        rating,
        housingType,
        roomAmount,
        guestAmount,
        price,
        amenities,
        name,
        email,
        userType,
        avatarPath,
        password,
        commentAmount,
        location,
      ]) => ({
        title,
        description,
        postDate: new Date(postDate),
        city: parseCity(city),
        imagePreview,
        images: images.split(';'),
        isPremium: Boolean(isPremium),
        isFavorite: Boolean(isFavorite),
        rating: Number.parseFloat(rating),
        housingType: parseHousingType(housingType),
        roomAmount: Number.parseInt(roomAmount, 10),
        guestAmount: Number.parseInt(guestAmount, 10),
        price: Number.parseInt(price, 10),
        amenities: parseAmenities(amenities),
        author: parseUser(email, name, userType, avatarPath, password),
        commentAmount: Number.parseInt(commentAmount, 10),
        location: parseLocation(location),
      }),
    );

    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }

      console.error(chalk.red(`Can't import data from file: ${chalk.bold(filename)}`));
      console.error(chalk.red(`Details: ${err.message}`));
    }
  }
}

export default ImportCommand;
