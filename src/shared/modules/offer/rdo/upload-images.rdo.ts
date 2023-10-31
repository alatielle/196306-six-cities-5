import { Expose } from 'class-transformer';

export class UploadImagesRdo {
  @Expose()
  public images: string[];
}
