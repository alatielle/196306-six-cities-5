import { Query } from 'express-serve-static-core';

export type QueryCity =
  | {
      city: string;
    }
  | Query;
