import type { History } from 'history';
import type { AxiosError, AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type {
  Comment,
  CommentAuth,
  FavoriteAuth,
  Offer,
  OfferFormOutput,
  OfferPreview,
  User,
  UserAuth,
  UserRegister
} from '../types/types';
import { ApiRoute, AppRoute, HttpCode } from '../const';
import { Token } from '../utils';
import {
  adaptAddOfferToServer,
  adaptAvatarToServer,
  adaptCreateCommentToServer,
  adaptEditOfferToServer,
  adaptImagesToServer,
  adaptPreviewToServer,
  adaptSignupToServer
} from '../utils/adapters/adaptersToServer';
import { UserDto } from '../dto/user/user.dto';
import { UserWithTokenDto } from '../dto/user/user-with-token.dto';
import { OfferPreviewDto } from '../dto/offer/offer-preview.dto';
import {
  adaptCommentsToClient,
  adaptCommentToClient,
  adaptLoginToClient,
  adaptOffersToClient,
  adaptOfferToClient
} from '../utils/adapters/adaptersToClient';
import { OfferDto } from '../dto/offer/offer.dto';
import { CommentDto } from '../dto/comment/comment.dto';

type Extra = {
  api: AxiosInstance;
  history: History;
};

export const Action = {
  FETCH_OFFERS: 'offers/fetch',
  FETCH_OFFER: 'offer/fetch',
  POST_OFFER: 'offer/post-offer',
  EDIT_OFFER: 'offer/edit-offer',
  DELETE_OFFER: 'offer/delete-offer',
  FETCH_FAVORITE_OFFERS: 'offers/fetch-favorite',
  FETCH_PREMIUM_OFFERS: 'offers/fetch-premium',
  FETCH_COMMENTS: 'offer/fetch-comments',
  POST_COMMENT: 'offer/post-comment',
  POST_FAVORITE: 'offer/post-favorite',
  DELETE_FAVORITE: 'offer/delete-favorite',
  LOGIN_USER: 'user/login',
  LOGOUT_USER: 'user/logout',
  FETCH_USER_STATUS: 'user/fetch-status',
  REGISTER_USER: 'user/register'
};

export const fetchOffers = createAsyncThunk<OfferPreview[], undefined, { extra: Extra }>(
  Action.FETCH_OFFERS,
  async (_, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<OfferPreviewDto[]>(ApiRoute.Offers);

    return adaptOffersToClient(data);
  });

export const fetchFavoriteOffers = createAsyncThunk<OfferPreview[], undefined, { extra: Extra }>(
  Action.FETCH_FAVORITE_OFFERS,
  async (_, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<OfferPreviewDto[]>(`${ApiRoute.Offers}${ApiRoute.Favorites}`);

    return adaptOffersToClient(data);
  });

export const fetchOffer = createAsyncThunk<Offer, Offer['id'], { extra: Extra }>(
  Action.FETCH_OFFER,
  async (id, { extra }) => {
    const { api, history } = extra;

    try {
      const { data } = await api.get<OfferDto>(`${ApiRoute.Offers}/${id}`);

      return adaptOfferToClient(data);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === HttpCode.NotFound) {
        history.push(AppRoute.NotFound);
      }

      return Promise.reject(error);
    }
  });

export const postOffer = createAsyncThunk<Offer, OfferFormOutput, {
  extra: Extra
}>(
  Action.POST_OFFER,
  async (newOffer, { extra }) => {
    const { api, history } = extra;
    const { data: offer, status } = await api.post<OfferDto>(ApiRoute.Offers, adaptAddOfferToServer(newOffer));

    if (status === HttpCode.Created) {
      if (newOffer.previewImage) {
        await api.post(`${ApiRoute.Offers}/${offer.id}/preview`, adaptPreviewToServer(newOffer.previewImage), {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      if (newOffer.images.length > 0) {
        await api.post(`${ApiRoute.Offers}/${offer.id}/images`, adaptImagesToServer(newOffer.images), {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
    }

    history.push(`${AppRoute.Property}/${offer.id}`);

    return adaptOfferToClient(offer);
  });

export const editOffer = createAsyncThunk<Offer, OfferFormOutput & { id: string }, { extra: Extra }>(
  Action.EDIT_OFFER,
  async (offer, { extra }) => {
    const { api, history } = extra;
    const { data, status } = await api.patch<OfferDto>(`${ApiRoute.Offers}/${offer.id}`, adaptEditOfferToServer(offer));

    if (status === HttpCode.OK) {
      if (offer.previewImage) {
        await api.post(`${ApiRoute.Offers}/${offer.id}/preview`, adaptPreviewToServer(offer.previewImage), {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      if (offer.images.length > 0) {
        await api.post(`${ApiRoute.Offers}/${offer.id}/images`, adaptImagesToServer(offer.images), {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
    }

    history.push(`${AppRoute.Property}/${data.id}`);

    return adaptOfferToClient(data);
  });

export const deleteOffer = createAsyncThunk<void, string, { extra: Extra }>(
  Action.DELETE_OFFER,
  async (id, { extra }) => {
    const { api, history } = extra;
    await api.delete(`${ApiRoute.Offers}/${id}`);
    history.push(AppRoute.Root);
  });

export const fetchPremiumOffers = createAsyncThunk<OfferPreview[], string, { extra: Extra }>(
  Action.FETCH_PREMIUM_OFFERS,
  async (cityName, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<OfferPreviewDto[]>(`${ApiRoute.Offers}${ApiRoute.Premium}?city=${cityName}`);

    return adaptOffersToClient(data);
  });

export const fetchComments = createAsyncThunk<Comment[], Offer['id'], { extra: Extra }>(
  Action.FETCH_COMMENTS,
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<CommentDto[]>(`${ApiRoute.Offers}/${id}${ApiRoute.Comments}`);

    return adaptCommentsToClient(data);
  });

export const fetchUserStatus = createAsyncThunk<User, undefined, { extra: Extra }>(
  Action.FETCH_USER_STATUS,
  async (_, { extra }) => {
    const { api } = extra;

    try {
      const { data: user } = await api.get<UserWithTokenDto>(`${ApiRoute.Users}${ApiRoute.Login}`);

      return adaptLoginToClient(user);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === HttpCode.NoAuth) {
        Token.drop();
      }

      return Promise.reject(error);
    }
  });

export const loginUser = createAsyncThunk<User, UserAuth, { extra: Extra }>(
  Action.LOGIN_USER,
  async ({ email, password }, { extra }) => {
    const { api, history } = extra;
    const { data: user } = await api.post<UserWithTokenDto>(`${ApiRoute.Users}${ApiRoute.Login}`, { email, password });

    Token.save(user.token);
    history.push(AppRoute.Root);

    return adaptLoginToClient(user);
  });

export const logoutUser = createAsyncThunk<void, undefined, { extra: Extra }>(
  Action.LOGOUT_USER,
  async () => {
    Token.drop();
  });

export const registerUser = createAsyncThunk<void, UserRegister, { extra: Extra }>(
  Action.REGISTER_USER,
  async ({ email, password, name, avatar, type }, { dispatch, extra }) => {
    const { api, history } = extra;
    const { status } = await api.post<UserDto>(`${ApiRoute.Users}${ApiRoute.Register}`, adaptSignupToServer({
      email,
      password,
      name,
      type
    }));

    if (status === HttpCode.Created) {
      const action = await dispatch(loginUser({ email, password }));

      if (action.type === loginUser.fulfilled.type && avatar) {
        await api.post(`${ApiRoute.Users}${ApiRoute.Avatar}`, adaptAvatarToServer(avatar), {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        await dispatch(fetchUserStatus());
      }

      history.push(AppRoute.Root);
    }
  });


export const postComment = createAsyncThunk<Comment, CommentAuth, { extra: Extra }>(
  Action.POST_COMMENT,
  async ({ id, comment, rating }, { extra }) => {
    const { api } = extra;
    const { data } = await api.post<CommentDto>(ApiRoute.Comments, adaptCreateCommentToServer({
      comment,
      rating,
      id
    }));

    return adaptCommentToClient(data);
  });

export const postFavorite = createAsyncThunk<
  string,
  FavoriteAuth,
  { extra: Extra }
>(Action.POST_FAVORITE, async (id, { extra }) => {
  const { api, history } = extra;

  try {
    await api.put(
      `${ApiRoute.Offers}/${id}${ApiRoute.Favorite}`,
      {
        isFavorite: true
      }
    );

    return id;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === HttpCode.NoAuth) {
      history.push(AppRoute.Login);
    }

    return Promise.reject(error);
  }
});

export const deleteFavorite = createAsyncThunk<
  string,
  FavoriteAuth,
  { extra: Extra }
>(Action.DELETE_FAVORITE, async (id, { extra }) => {
  const { api, history } = extra;

  try {
    await api.put(
      `${ApiRoute.Offers}/${id}${ApiRoute.Favorite}`,
      {
        isFavorite: false
      }
    );

    return id;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === HttpCode.NoAuth) {
      history.push(AppRoute.Login);
    }

    return Promise.reject(error);
  }
});
