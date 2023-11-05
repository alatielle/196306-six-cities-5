import store from '../store';

import type { Offer, Comment, City, SortName, User, OfferPreview } from './types';
import { AuthorizationStatus, SubmitStatus } from '../const';


export type SiteData = {
    offers: OfferPreview[];
    isOffersLoading: boolean;
    offer: Offer | null;
    isOfferLoading: boolean;
    favoriteOffers: OfferPreview[];
    isFavoriteOffersLoading: boolean;
    premiumOffers: OfferPreview[];
    comments: Comment[];
    commentStatus: SubmitStatus;
};

export type SiteProcess = {
    city: City;
    sorting: SortName;
}

export type UserProcess = {
    authorizationStatus: AuthorizationStatus;
    user: User | null;
}

export type State = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
