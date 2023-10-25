import { TokenPayload } from './src/shared/modules/auth';

declare module 'express-serve-static-core' {
  export interface Request {
    tokenPayload: TokenPayload;
  }
}
