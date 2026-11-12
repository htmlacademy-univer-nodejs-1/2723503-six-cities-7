import { SignJWT } from 'jose';
import { TokenPayload } from '../types/index.js';

export const JWT_ALGORITHM = 'HS256';
const JWT_EXPIRATION_TIME = '2d';

export function createJWT(payload: TokenPayload, secret: string): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION_TIME)
    .sign(new TextEncoder().encode(secret));
}
