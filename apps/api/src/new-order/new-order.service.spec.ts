import { BadRequestException } from '@nestjs/common';
import sharp from 'sharp';
import { NewOrderService } from './new-order.service';
import { type OrderExtractionService } from '../order-extraction/order-extraction.service';
import { type OrderExtractionResult } from '../order-extraction/order-extraction.types';

describe('NewOrderService', () => {
  it('creates a new order draft from a supported image', async () => {
    const extraction = sampleExtraction();
    const extractFromImage: jest.MockedFunction<OrderExtractionService['extractFromImage']> = jest
      .fn()
      .mockResolvedValue(extraction);
    const orderExtraction = {
      extractFromImage,
    } as unknown as OrderExtractionService;
    const service = new NewOrderService(orderExtraction);

    await expect(
      service.createFromImage({
        buffer: await validPngBuffer(),
        mimetype: 'image/png',
        size: 5,
        originalname: 'order.png',
      }),
    ).resolves.toBe(extraction);

    expect(extractFromImage).toHaveBeenCalledTimes(1);
    expect(extractFromImage.mock.calls[0]?.[0].mimeType).toBe('image/jpeg');
    expect(Buffer.isBuffer(extractFromImage.mock.calls[0]?.[0].buffer)).toBe(true);
  });

  it('rejects unsupported image types', async () => {
    const orderExtraction = { extractFromImage: jest.fn() } as unknown as OrderExtractionService;
    const service = new NewOrderService(orderExtraction);

    await expect(
      service.createFromImage({
        buffer: Buffer.from('pdf'),
        mimetype: 'application/pdf',
        size: 5,
        originalname: 'order.pdf',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});

function sampleExtraction(): OrderExtractionResult {
  return {
    client: { fullName: { value: 'Jean Dupont', confidence: 'high' } },
    order: {
      deliveryDate: { value: null, rawValue: null, status: 'unknown', confidence: 'low' },
      advisor: { value: null, confidence: 'low' },
    },
    items: [],
    barcodes: {
      reception: { label: 'Réception', rawText: null, digits: null, suffix: null, confidence: 'low' },
      centrage: { label: 'Centrage', rawText: null, digits: null, suffix: null, confidence: 'low' },
      montage: { label: 'Montage', rawText: null, digits: null, suffix: null, confidence: 'low' },
      verification: { label: 'Vérification', rawText: null, digits: null, suffix: null, confidence: 'low' },
    },
    warnings: [],
  };
}

function validPngBuffer(): Promise<Buffer> {
  return sharp({
    create: {
      width: 1,
      height: 1,
      channels: 3,
      background: '#ffffff',
    },
  })
    .png()
    .toBuffer();
}
