import CreateUserDto from '../../dto/user/create-user.dto';
import { UserType as ServerUserType } from '../../dto/user/types';
import { CommentAuth, OfferFormOutput, Type, UserRegister } from '../../types/types';
import { UserType } from '../../const';
import { CreateCommentDto } from '../../dto/comment/create-comment.dto';
import { CreateOfferDto } from '../../dto/offer/create-offer.dto';
import { AmenityType, City, HousingType } from '../../dto/offer/types';
import { getTime } from '../index';
import { UpdateOfferDto } from '../../dto/offer/update-offer.dto';

export const adaptSignupToServer =
  (user: UserRegister): CreateUserDto => ({
    email: user.email,
    name: user.name,
    avatarPath: '',
    password: user.password,
    type: user.type === UserType.Pro ? ServerUserType.Pro : ServerUserType.Regular
  });

export const adaptTypeToServer = (type: Type): HousingType => {
  switch (type) {
    case 'apartment':
      return HousingType.Apartment;
    case 'hotel':
      return HousingType.Hotel;
    case 'house':
      return HousingType.House;
    case 'room':
      return HousingType.Room;
    default:
      throw new Error(`Unknown type ${type}`);
  }
};

export const adaptAddOfferToServer = (offer: OfferFormOutput): CreateOfferDto => ({
  title: offer.title,
  description: offer.description,
  city: offer.city.name as City,
  isPremium: offer.isPremium,
  housingType: adaptTypeToServer(offer.type),
  roomAmount: offer.bedrooms,
  guestAmount: offer.maxAdults,
  price: offer.price,
  amenities: offer.goods as AmenityType[],
  location: offer.location,
  postDate: getTime()
});

export const adaptEditOfferToServer =
  (offer: OfferFormOutput): UpdateOfferDto => ({
    title: offer.title,
    description: offer.description,
    city: offer.city.name as City,
    isPremium: offer.isPremium,
    housingType: adaptTypeToServer(offer.type),
    roomAmount: offer.bedrooms,
    guestAmount: offer.maxAdults,
    price: offer.price,
    amenities: offer.goods as AmenityType[],
    location: offer.location
  });

export const adaptCreateCommentToServer =
  (comment: CommentAuth): CreateCommentDto => ({
    text: comment.comment,
    rating: comment.rating,
    offerId: comment.id
  });

export const adaptAvatarToServer =
  (file: File) => {
    const formData = new FormData();
    formData.set('avatar', file);

    return formData;
  };

export const adaptPreviewToServer =
  (file: File) => {
    const formData = new FormData();
    formData.set('preview', file);

    return formData;
  };

export const adaptImagesToServer =
  (files: File[]) => {
    const formData = new FormData();
    files
      .map(async (file) => {
        formData.append('image', file);
      });

    return formData;
  };
