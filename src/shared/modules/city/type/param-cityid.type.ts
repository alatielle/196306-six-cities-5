import { ParamsDictionary } from 'express-serve-static-core';

export type ParamCityId =
  | {
      cityId: string;
    }
  | ParamsDictionary;
