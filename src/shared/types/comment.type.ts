import { User } from './user.type.js';

export type Comment = {
  text: string;
  postDate: Date;
  rating: number;
  author: User;
};
