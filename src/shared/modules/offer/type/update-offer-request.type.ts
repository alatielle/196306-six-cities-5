import { Request } from 'express';
import { UpdateOfferDto } from '../dto/update-offer.dto.js';
import { ParamOfferId } from './param-offerid.type.js';

export type UpdateOfferRequest = Request<ParamOfferId, unknown, UpdateOfferDto>;
