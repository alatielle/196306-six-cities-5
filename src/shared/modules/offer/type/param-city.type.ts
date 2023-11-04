import { ParamsDictionary } from 'express-serve-static-core';

export type ParamCity =
  | {
      city: string;
    }
  | ParamsDictionary;
