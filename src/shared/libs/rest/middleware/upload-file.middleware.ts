import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { extension } from 'mime-types';
import multer, { diskStorage, MulterError } from 'multer';
import { nanoid } from 'nanoid';
import { HttpError } from '../errors/http-error.js';
import { Middleware } from './middleware.interface.js';

export class UploadFileMiddleware implements Middleware {
  constructor(
    private readonly uploadDirectory: string,
    private readonly fieldName: string,
    private readonly allowedMimeTypes: string[],
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        callback(null, `${nanoid()}.${extension(file.mimetype)}`);
      },
    });

    const uploadSingleFileMiddleware = multer({
      storage,
      fileFilter: (_req, file, callback) => {
        if (!this.allowedMimeTypes.includes(file.mimetype)) {
          return callback(new HttpError(
            StatusCodes.BAD_REQUEST,
            `File type ${file.mimetype} is not allowed. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
            'UploadFileMiddleware',
          ));
        }

        callback(null, true);
      },
    }).single(this.fieldName);

    uploadSingleFileMiddleware(req, res, (error?: unknown) => {
      if (error instanceof MulterError) {
        return next(new HttpError(StatusCodes.BAD_REQUEST, error.message, 'UploadFileMiddleware'));
      }

      next(error);
    });
  }
}
