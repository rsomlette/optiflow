import { BadGatewayException } from '@nestjs/common';
import { OrderExtractionService } from './order-extraction.service';
import { type VisionLlmClient } from '../vision-llm/vision-llm-client';

describe('OrderExtractionService', () => {
  it('extracts and normalizes order data from the vision LLM response', async () => {
    const visionLlm: VisionLlmClient = {
      requestJson: jest.fn().mockResolvedValue(validLlmResponse()),
    };
    const service = new OrderExtractionService(visionLlm);

    const result = await service.extractFromImage({
      buffer: Buffer.from('image'),
      mimeType: 'image/png',
    });

    expect(visionLlm.requestJson).toHaveBeenCalledWith(
      expect.objectContaining({
        image: { buffer: Buffer.from('image'), mimeType: 'image/png' },
      }),
    );
    expect(result.client.fullName.value).toBe('Jean Dupont');
    expect(result.barcodes.reception.digits).toBe('1234567890123');
    expect(result.barcodes.reception.suffix).toBe('AB');
  });

  it('rejects malformed LLM responses', async () => {
    const visionLlm: VisionLlmClient = {
      requestJson: jest.fn().mockResolvedValue({ client: null }),
    };
    const service = new OrderExtractionService(visionLlm);

    await expect(
      service.extractFromImage({ buffer: Buffer.from('image'), mimeType: 'image/png' }),
    ).rejects.toBeInstanceOf(BadGatewayException);
  });

  it('does not accept non-barcode text as barcode digits', async () => {
    const response = validLlmResponse() as Record<string, unknown>;
    const barcodes = response.barcodes as Record<string, unknown>;
    barcodes.reception = {
      label: 'Réception',
      rawText: '20/09/2023 18:34',
      digits: '200920231834',
      suffix: '34',
      confidence: 'high',
    };
    const visionLlm: VisionLlmClient = {
      requestJson: jest.fn().mockResolvedValue(response),
    };
    const service = new OrderExtractionService(visionLlm);

    const result = await service.extractFromImage({
      buffer: Buffer.from('image'),
      mimeType: 'image/png',
    });

    expect(result.barcodes.reception.rawText).toBe('20/09/2023 18:34');
    expect(result.barcodes.reception.digits).toBeNull();
    expect(result.barcodes.reception.suffix).toBeNull();
    expect(result.barcodes.reception.confidence).toBe('low');
  });

  it('normalizes common schema drift from the vision LLM', async () => {
    const response = validLlmResponse() as Record<string, unknown>;
    const order = response.order as Record<string, unknown>;
    order.advisor = 'SOMLETTE Gilles';
    response.barcodes = [
      {
        reception: {
          label: 'Réception',
          rawText: '*1234567890123AB*',
          digits: null,
          suffix: null,
          confidence: 'high',
        },
      },
    ];
    const visionLlm: VisionLlmClient = {
      requestJson: jest.fn().mockResolvedValue(response),
    };
    const service = new OrderExtractionService(visionLlm);

    const result = await service.extractFromImage({
      buffer: Buffer.from('image'),
      mimeType: 'image/png',
    });

    expect(result.order.advisor).toEqual({ value: 'SOMLETTE Gilles', confidence: 'medium' });
    expect(result.barcodes.reception.digits).toBe('1234567890123');
    expect(result.barcodes.centrage.rawText).toBeNull();
  });

  it('skips malformed extra items from the vision LLM', async () => {
    const response = validLlmResponse() as Record<string, unknown>;
    response.items = [...(response.items as unknown[]), 'unexpected text item'];
    const visionLlm: VisionLlmClient = {
      requestJson: jest.fn().mockResolvedValue(response),
    };
    const service = new OrderExtractionService(visionLlm);

    const result = await service.extractFromImage({
      buffer: Buffer.from('image'),
      mimeType: 'image/png',
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.label.value).toBe('Paire principale');
  });
});

function validLlmResponse(): unknown {
  return {
    client: { fullName: { value: 'Jean Dupont', confidence: 'high' } },
    order: {
      deliveryDate: {
        value: '2026-06-28',
        rawValue: '28/06/2026',
        status: 'estimated',
        confidence: 'high',
      },
      advisor: { value: 'Marie', confidence: 'medium' },
    },
    items: [
      {
        label: { value: 'Paire principale', confidence: 'medium' },
        lenses: {
          right: {
            correction: { value: '-0.75 (+0.75) 90° Add +2.25', confidence: 'medium' },
            details: { value: 'verre progressif anti-reflet', confidence: 'medium' },
          },
          left: {
            correction: { value: '-0.75 (+0.75) 90° Add +2.25', confidence: 'medium' },
            details: { value: 'verre progressif anti-reflet', confidence: 'medium' },
          },
        },
        frame: { value: 'Monture noire', confidence: 'high' },
        notes: { value: null, confidence: 'low' },
      },
    ],
    barcodes: {
      reception: { label: 'Réception', rawText: '*1234567890123AB*', digits: null, suffix: null, confidence: 'high' },
      centrage: { label: 'Centrage', rawText: null, digits: null, suffix: null, confidence: 'low' },
      montage: { label: 'Montage', rawText: null, digits: null, suffix: null, confidence: 'low' },
      verification: { label: 'Vérification', rawText: null, digits: null, suffix: null, confidence: 'low' },
    },
    warnings: [],
  };
}
