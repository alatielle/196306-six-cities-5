import { Request } from 'express';
import { RequestBody, RequestParams } from '../../../libs/rest/index.js';
import { FavoriteOfferDto } from '../dto/favorite-offer.dto.js';

export type FavoriteOfferRequest = Request<
  RequestParams,
  RequestBody,
  FavoriteOfferDto
>;
