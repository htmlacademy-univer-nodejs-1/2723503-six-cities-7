import { TokenPayload } from './token-payload.type.js';

declare module 'express-serve-static-core' {
  export interface Request {
    tokenPayload?: TokenPayload;
  }
}
