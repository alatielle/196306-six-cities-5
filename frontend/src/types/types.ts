import { CITIES, Sorting, TYPES, UserType } from '../const';

export type CityName = typeof CITIES[number];
export type Type = typeof TYPES[number];
export type SortName = keyof typeof Sorting;

export type Location = {
  latitude: number;
  longitude: number;
};

export type City = {
  name: CityName;
  location: Location;
};

export type User = {
  name: string;
  avatarUrl: string;
  type: UserType;
  email: string;
};

export type Comment = {
  id: string;
  comment: string;
  date: string;
  rating: number;
  user: User;
};

export type OfferPreview = {
  id: string;
  title: string;
  price: number;
  rating: number;
  isPremium: boolean;
  isFavorite: boolean;
  city: City;
  previewImage: string;
  type: Type;
  location: Location;
};

export type Offer = OfferPreview & {
  bedrooms: number;
  description: string;
  goods: string[];
  host: User;
  images: string[];
  maxAdults: number;
};

export type OfferDraft = {
  title: string;
  description: string;
  city: City;
  isPremium: boolean;
  type: Type;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: string[];
  location: Location;
  previewImage: string;
  images: string[];
}

export type OfferFormOutput = {
  title: string;
  description: string;
  city: City;
  isPremium: boolean;
  type: Type;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: string[];
  location: Location;
  previewImage?: File;
  images: File[];
};

export type NewComment = Pick<Comment, 'comment' | 'rating'>;
export type UserAuth = Pick<User, 'email'> & { password: string };
export type CommentAuth = NewComment &
  Pick<Offer, 'id'>;
export type FavoriteAuth = Offer['id'];
export type UserRegister = Omit<User, 'avatarUrl'> &
  Pick<UserAuth, 'password'> & { avatar?: File };

export type ValidationErrorField = {
  value: string;
  messages: string[];
}
