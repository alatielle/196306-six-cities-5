import dayjs from 'dayjs';
import { randomCirclePoint } from 'random-location';

import { OfferGenerator } from './offer-generator.interface.js';
import {
  AmenityType,
  Coordinates,
  HousingType,
  type MockServerData,
  UserType,
} from '../../types/index.js';
import {
  generateRandomValue,
  getRandomItem,
  getRandomItems,
} from '../../helpers/index.js';
import { GUESTS, PRICE, ROOMS, WEEK_DAY } from './constraints.js';

const formatLocation = ({ latitude, longitude }: Coordinates) =>
  [latitude, longitude].join(';');

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const postDate = dayjs()
      .subtract(generateRandomValue(WEEK_DAY.FIRST, WEEK_DAY.LAST), 'day')
      .toISOString();
    const city = getRandomItem(this.mockData.cities);
    const imagePreview = getRandomItem(this.mockData.previewImages);
    const images = getRandomItems(this.mockData.roomImages).join(';');
    const isPremium = getRandomItem([true, false]);
    const housingType = getRandomItem(Object.values(HousingType));
    const roomAmount = generateRandomValue(ROOMS.MIN, ROOMS.MAX);
    const guestAmount = generateRandomValue(GUESTS.MIN, GUESTS.MAX);
    const price = generateRandomValue(PRICE.MIN, PRICE.MAX);
    const amenities = getRandomItems(Object.values(AmenityType)).join(';');
    const name = getRandomItem(this.mockData.users);
    const email = getRandomItem(this.mockData.emails);
    const userType = getRandomItem(Object.values(UserType));
    const avatarPath = getRandomItem(this.mockData.avatars);
    const location = randomCirclePoint(city, 5000);

    return [
      title,
      description,
      postDate,
      city.name,
      formatLocation(city),
      imagePreview,
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
      formatLocation(location),
    ].join('\t');
  }
}
