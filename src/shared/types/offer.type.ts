import { City } from './city.enum.js';
import { HousingType } from './housing-type.enum.js';
import { AmenityType } from './amenity-type.enum.js';
import { User } from './user.type.js';
import { Coordinates } from './coordinate.type.js';

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: City;
  images: string[];
  isPremium: boolean;
  housingType: HousingType;
  roomAmount: number;
  guestAmount: number;
  price: number;
  amenities: AmenityType[];
  author: User;
  location: Coordinates;
};
