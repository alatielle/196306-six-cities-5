import { Comment, Offer, OfferPreview, Type, User } from '../../types/types';
import { CityLocation, UserType } from '../../const';
import { UserType as ServerUserType } from '../../dto/user/types';
import { UserDto } from '../../dto/user/user.dto';
import { UserWithTokenDto } from '../../dto/user/user-with-token.dto';
import { OfferDto } from '../../dto/offer/offer.dto';
import { HousingType } from '../../dto/offer/types';
import { OfferPreviewDto } from '../../dto/offer/offer-preview.dto';
import { CommentDto } from '../../dto/comment/comment.dto';

export const adaptLoginToClient =
  (user: UserWithTokenDto): User => ({
    name: user.name,
    email: user.email,
    type: user.type === ServerUserType.Pro ? UserType.Pro : UserType.Regular,
    avatarUrl: user.avatarPath
  });

export const adaptUserToClient =
  (user: UserDto): User => ({
    name: user.name,
    email: user.email,
    type: user.type,
    avatarUrl: user.avatarPath
  });

export const adaptHousingTypeToClient = (housingType: HousingType): Type => {
  switch (housingType) {
    case HousingType.Apartment:
      return 'apartment';
    case HousingType.Hotel:
      return 'hotel';
    case HousingType.House:
      return 'house';
    case HousingType.Room:
      return 'room';
    default:
      throw new Error(`Unknown type ${housingType}`);
  }
};

export const adaptOfferToClient = (offer: OfferDto): Offer => ({
  id: offer.id,
  price: offer.price,
  rating: offer.rating,
  title: offer.title,
  isPremium: offer.isPremium,
  isFavorite: offer.isFavorite,
  city: {
    name: offer.city,
    location: CityLocation[offer.city]
  },
  location: offer.location,
  previewImage: offer.imagePreview,
  type: adaptHousingTypeToClient(offer.housingType),
  bedrooms: offer.roomAmount,
  description: offer.description,
  goods: offer.amenities,
  host: adaptUserToClient(offer.author),
  images: offer.images,
  maxAdults: offer.guestAmount
});

export const adaptOfferPreviewToClient = (offer: OfferPreviewDto): OfferPreview => ({
  id: offer.id,
  price: offer.price,
  rating: offer.rating,
  title: offer.title,
  isPremium: offer.isPremium,
  isFavorite: offer.isFavorite,
  city: {
    name: offer.city,
    location: CityLocation[offer.city]
  },
  location: offer.location,
  previewImage: offer.imagePreview,
  type: adaptHousingTypeToClient(offer.housingType),
});

export const adaptOffersToClient = (offers: OfferPreviewDto[]): OfferPreview[] => offers.map((offer) => adaptOfferPreviewToClient(offer));

export const adaptCommentToClient = (comment: CommentDto): Comment => ({
  comment: comment.text,
  rating: comment.rating,
  date: comment.postDate,
  user: adaptUserToClient(comment.author),
  id: comment.id
});

export const adaptCommentsToClient = (comments: CommentDto[]): Comment[] => comments.map((comment) => adaptCommentToClient(comment));
