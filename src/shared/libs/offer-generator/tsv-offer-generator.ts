import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import { AmenityType, City, HousingType, type MockServerData, UserType } from '../../types/index.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';
import { COMMENTS, GUESTS, LATITUDE, LONGITUDE, PRICE, RATING, ROOMS, WEEK_DAY } from './constraints.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const postDate = dayjs().subtract(generateRandomValue(WEEK_DAY.FIRST, WEEK_DAY.LAST), 'day').toISOString();
    const city = getRandomItem(Object.values(City));
    const imagePreview = getRandomItem(this.mockData.previewImages);
    const images = getRandomItems(this.mockData.roomImages).join(';');
    const isPremium = getRandomItem([true, false]);
    const isFavorite = getRandomItem([true, false]);
    const rating = generateRandomValue(RATING.MIN, RATING.MAX, 1);
    const housingType = getRandomItem(Object.values(HousingType));
    const roomAmount = generateRandomValue(ROOMS.MIN, ROOMS.MAX);
    const guestAmount = generateRandomValue(GUESTS.MIN, GUESTS.MAX);
    const price = generateRandomValue(PRICE.MIN, PRICE.MAX);
    const amenities = getRandomItems(Object.values(AmenityType)).join(';');
    const name = getRandomItem(this.mockData.users);
    const email = getRandomItem(this.mockData.emails);
    const userType = getRandomItem(Object.values(UserType));
    const avatarPath = getRandomItem(this.mockData.avatars);
    const commentAmount = generateRandomValue(COMMENTS.MIN, COMMENTS.MAX);
    const location = [
      generateRandomValue(LATITUDE.MIN, LATITUDE.MAX, 6),
      generateRandomValue(LONGITUDE.MIN, LONGITUDE.MAX, 6),
    ].join(';');

    return [
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
      commentAmount,
      location,
    ].join('\t');
  }
}
