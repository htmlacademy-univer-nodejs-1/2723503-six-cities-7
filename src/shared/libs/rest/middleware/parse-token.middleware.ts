import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { jwtVerify } from 'jose';
import { JWT_ALGORITHM } from '../../../helpers/jwt.js';
import { TokenPayload } from '../../../types/index.js';
import { HttpError } from '../errors/http-error.js';
import { Middleware } from './middleware.interface.js';

function isTokenPayload(payload: unknown): payload is TokenPayload {
  return typeof payload === 'object'
    && payload !== null
    && typeof (payload as Record<string, unknown>).id === 'string'
    && typeof (payload as Record<string, unknown>).email === 'string';
}

export class ParseTokenMiddleware implements Middleware {
  constructor(private readonly jwtSecret: string) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers.authorization?.split(' ');

    if (!authorizationHeader) {
      return next();
    }

    const [, token] = authorizationHeader;
    let payload: unknown;

    try {
      ({ payload } = await jwtVerify(token, new TextEncoder().encode(this.jwtSecret), {
        algorithms: [JWT_ALGORITHM],
      }));
    } catch {
      return next(new HttpError(StatusCodes.UNAUTHORIZED, 'Invalid token', 'ParseTokenMiddleware'));
    }

    if (!isTokenPayload(payload)) {
      return next(new HttpError(StatusCodes.UNAUTHORIZED, 'Invalid token', 'ParseTokenMiddleware'));
    }

    req.tokenPayload = { id: payload.id, email: payload.email };
    next();
  }
}
