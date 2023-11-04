import { NextFunction, Request, Response } from 'express';
import multer, { diskStorage } from 'multer';
import { extension } from 'mime-types';
import { nanoid } from 'nanoid';
import { Middleware } from './middleware.interface.js';

export class UploadFileMiddleware implements Middleware {
  constructor(
    private uploadDirectory: string,
    private fieldName: string,
    private allowedMimeTypes: string[],
    private maxFileAmount?: number
  ) {}

  public async execute(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const fileExtension = extension(file.mimetype);
        const filename = nanoid();
        callback(null, `${filename}.${fileExtension}`);
      }
    });

    const uploadFileMiddleware = multer({
      storage, fileFilter: (_req, file, callback) => {
        if (!this.allowedMimeTypes.includes(file.mimetype)) {
          return callback(new Error(`${file.mimetype} is not allowed`));
        }
        callback(null, true);
      }
    });

    if (this.maxFileAmount) {
      return uploadFileMiddleware.array(this.fieldName, this.maxFileAmount)(req, res, next);
    }

    uploadFileMiddleware.single(this.fieldName)(req, res, next);
  }
}
