import { BadGatewayException } from '@nestjs/common';
import {
  type BarcodeExtraction,
  type Confidence,
  type DeliveryDateStatus,
  type ExtractedDateField,
  type ExtractedField,
  type OrderExtractionItem,
  type OrderExtractionResult,
} from './order-extraction.types';

const BARCODE_PATTERN = /^\*(\d{13})([A-Z0-9]{2})\*$/i;

const CONFIDENCES: Confidence[] = ['high', 'medium', 'low'];
const DATE_STATUSES: DeliveryDateStatus[] = ['estimated', 'confirmed', 'unknown'];

export function parseOrderExtractionResult(value: unknown): OrderExtractionResult {
  const source = asRecord(value, 'extraction result');
  const barcodes = parseBarcodeCollection(source.barcodes);

  return {
    client: { fullName: parseField(asRecord(source.client, 'client').fullName, 'client.fullName') },
    order: {
      deliveryDate: parseDateField(asRecord(source.order, 'order').deliveryDate),
      advisor: parseField(asRecord(source.order, 'order').advisor, 'order.advisor'),
    },
    items: parseItems(source.items),
    barcodes: {
      reception: parseBarcode(barcodes.reception, 'Réception'),
      centrage: parseBarcode(barcodes.centrage, 'Centrage'),
      montage: parseBarcode(barcodes.montage, 'Montage'),
      verification: parseBarcode(barcodes.verification, 'Vérification'),
    },
    warnings: parseWarnings(source.warnings),
  };
}

function parseItems(value: unknown): OrderExtractionItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item, index) => {
    if (!isRecord(item)) {
      return [];
    }

    const source = item;

    try {
      return [{
        label: parseField(source.label, `items.${index}.label`),
        lenses: parseLenses(source.lenses, index),
        frame: parseField(source.frame, `items.${index}.frame`),
        notes: parseField(source.notes, `items.${index}.notes`),
      }];
    } catch {
      return [];
    }
  });
}

function parseLenses(value: unknown, index: number): OrderExtractionItem['lenses'] {
  const source = value === undefined || value === null ? {} : asRecord(value, `items.${index}.lenses`);

  return {
    right: parseLens(source.right, `items.${index}.lenses.right`),
    left: parseLens(source.left, `items.${index}.lenses.left`),
  };
}

function parseLens(value: unknown, path: string): OrderExtractionItem['lenses']['right'] {
  const source = value === undefined || value === null ? {} : asRecord(value, path);

  return {
    correction: parseField(source.correction, `${path}.correction`),
    details: parseField(source.details, `${path}.details`),
  };
}

function parseField(value: unknown, path: string): ExtractedField<string> {
  if (typeof value === 'string') {
    return { value, confidence: 'medium' };
  }

  if (value === null || value === undefined) {
    return { value: null, confidence: 'low' };
  }

  const source = asRecord(value, path);
  const fieldValue = source.value;

  if (fieldValue !== null && typeof fieldValue !== 'string') {
    throw new BadGatewayException(`Vision LLM returned invalid ${path}.value`);
  }

  return {
    value: fieldValue,
    confidence: parseConfidence(source.confidence, path),
  };
}

function parseDateField(value: unknown): ExtractedDateField {
  const source = asRecord(value, 'order.deliveryDate');
  const parsed = parseField(source, 'order.deliveryDate');

  if (source.rawValue !== null && typeof source.rawValue !== 'string') {
    throw new BadGatewayException('Vision LLM returned invalid order.deliveryDate.rawValue');
  }

  return {
    ...parsed,
    rawValue: source.rawValue,
    status: parseDateStatus(source.status),
  };
}

function parseBarcode(value: unknown, label: BarcodeExtraction['label']): BarcodeExtraction {
  if (value === null || value === undefined) {
    return emptyBarcode(label);
  }

  const source = asRecord(value, `barcodes.${label}`);
  const rawText = parseNullableString(source.rawText, `barcodes.${label}.rawText`);
  const match = rawText?.match(BARCODE_PATTERN);

  if (rawText && !match) {
    return { label, rawText, digits: null, suffix: null, confidence: 'low' };
  }

  return {
    label,
    rawText,
    digits: match?.[1] ?? null,
    suffix: match?.[2]?.toUpperCase() ?? null,
    confidence: parseConfidence(source.confidence, `barcodes.${label}`),
  };
}

function parseBarcodeCollection(value: unknown): Record<string, unknown> {
  if (!Array.isArray(value)) {
    return asRecord(value, 'barcodes');
  }

  return value.reduce<Record<string, unknown>>((barcodes, item) => {
    const source = asRecord(item, 'barcodes[]');

    for (const [key, barcode] of Object.entries(source)) {
      barcodes[key] = barcode;
    }

    return barcodes;
  }, {});
}

function emptyBarcode(label: BarcodeExtraction['label']): BarcodeExtraction {
  return { label, rawText: null, digits: null, suffix: null, confidence: 'low' };
}

function parseWarnings(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((warning): warning is string => typeof warning === 'string');
}

function parseConfidence(value: unknown, path: string): Confidence {
  if (typeof value === 'string' && CONFIDENCES.includes(value as Confidence)) {
    return value as Confidence;
  }

  throw new BadGatewayException(`Vision LLM returned invalid ${path}.confidence`);
}

function parseDateStatus(value: unknown): DeliveryDateStatus {
  if (typeof value === 'string' && DATE_STATUSES.includes(value as DeliveryDateStatus)) {
    return value as DeliveryDateStatus;
  }

  return 'unknown';
}

function parseNullableString(value: unknown, path: string): string | null {
  if (value === null || typeof value === 'string') {
    return value;
  }

  throw new BadGatewayException(`Vision LLM returned invalid ${path}`);
}

function asRecord(value: unknown, path: string): Record<string, unknown> {
  if (isRecord(value)) {
    return value;
  }

  throw new BadGatewayException(`Vision LLM returned invalid ${path}`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
