import { BadRequestException, Injectable } from '@nestjs/common';
import heicConvert from 'heic-convert';
import sharp from 'sharp';
import { OrderExtractionService } from '../order-extraction/order-extraction.service';
import { type OrderExtractionResult } from '../order-extraction/order-extraction.types';
import { type UploadedImageFile } from './uploaded-image-file';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const MAX_LLM_IMAGE_DIMENSION = 1_400;

@Injectable()
export class NewOrderService {
  constructor(private readonly orderExtraction: OrderExtractionService) {}

  public async createFromImage(file: UploadedImageFile): Promise<OrderExtractionResult> {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Only JPEG, PNG, WEBP, HEIC, and HEIF images are supported');
    }

    const image = await this.normalizeImage(file.buffer, file.mimetype);

    return this.orderExtraction.extractFromImage({
      buffer: image,
      mimeType: 'image/jpeg',
    });
  }

  private async normalizeImage(buffer: Buffer, mimeType: string): Promise<Buffer> {
    try {
      const decoded = await this.decodeHeic(buffer, mimeType);

      return await sharp(decoded, { limitInputPixels: 50_000_000 })
        .rotate()
        .resize({
          width: MAX_LLM_IMAGE_DIMENSION,
          height: MAX_LLM_IMAGE_DIMENSION,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 82, mozjpeg: true })
        .toBuffer();
    } catch {
      throw new BadRequestException('Image file could not be decoded');
    }
  }

  private async decodeHeic(buffer: Buffer, mimeType: string): Promise<Buffer> {
    if (mimeType !== 'image/heic' && mimeType !== 'image/heif') {
      return buffer;
    }

    const converted = await heicConvert({ buffer, format: 'JPEG', quality: 0.9 });

    if (converted instanceof ArrayBuffer) {
      return Buffer.from(new Uint8Array(converted));
    }

    return Buffer.from(converted);
  }
}
