import { BadRequestException, Controller, HttpCode, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { type OrderExtractionResult } from '../order-extraction/order-extraction.types';
import { NewOrderService } from './new-order.service';
import { type UploadedImageFile } from './uploaded-image-file';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

@Controller('new')
export class NewOrderController {
  constructor(private readonly newOrder: NewOrderService) {}

  @Post()
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_IMAGE_BYTES } }))
  public async createFromImage(@UploadedFile() file?: UploadedImageFile): Promise<OrderExtractionResult> {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    return this.newOrder.createFromImage(file);
  }
}
