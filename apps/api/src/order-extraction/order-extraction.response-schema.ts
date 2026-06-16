const CONFIDENCE_SCHEMA = { type: 'string', enum: ['high', 'medium', 'low'] } as const;
const STRING_FIELD_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['value', 'confidence'],
  properties: {
    value: { type: ['string', 'null'] },
    confidence: CONFIDENCE_SCHEMA,
  },
} as const;

const LENS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['correction', 'details'],
  properties: {
    correction: STRING_FIELD_SCHEMA,
    details: STRING_FIELD_SCHEMA,
  },
} as const;

const BARCODE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['label', 'rawText', 'digits', 'suffix', 'confidence'],
  properties: {
    label: { type: 'string' },
    rawText: { type: ['string', 'null'] },
    digits: { type: ['string', 'null'] },
    suffix: { type: ['string', 'null'] },
    confidence: CONFIDENCE_SCHEMA,
  },
} as const;

export const ORDER_EXTRACTION_RESPONSE_SCHEMA: Record<string, unknown> = {
  type: 'object',
  additionalProperties: false,
  required: ['client', 'order', 'items', 'barcodes', 'warnings'],
  properties: {
    client: {
      type: 'object',
      additionalProperties: false,
      required: ['fullName'],
      properties: {
        fullName: STRING_FIELD_SCHEMA,
      },
    },
    order: {
      type: 'object',
      additionalProperties: false,
      required: ['deliveryDate', 'advisor'],
      properties: {
        deliveryDate: {
          type: 'object',
          additionalProperties: false,
          required: ['value', 'rawValue', 'status', 'confidence'],
          properties: {
            value: { type: ['string', 'null'] },
            rawValue: { type: ['string', 'null'] },
            status: { type: 'string', enum: ['estimated', 'confirmed', 'unknown'] },
            confidence: CONFIDENCE_SCHEMA,
          },
        },
        advisor: STRING_FIELD_SCHEMA,
      },
    },
    items: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['label', 'lenses', 'frame', 'notes'],
        properties: {
          label: STRING_FIELD_SCHEMA,
          lenses: {
            type: 'object',
            additionalProperties: false,
            required: ['right', 'left'],
            properties: {
              right: LENS_SCHEMA,
              left: LENS_SCHEMA,
            },
          },
          frame: STRING_FIELD_SCHEMA,
          notes: STRING_FIELD_SCHEMA,
        },
      },
    },
    barcodes: {
      type: 'object',
      additionalProperties: false,
      required: ['reception', 'centrage', 'montage', 'verification'],
      properties: {
        reception: BARCODE_SCHEMA,
        centrage: BARCODE_SCHEMA,
        montage: BARCODE_SCHEMA,
        verification: BARCODE_SCHEMA,
      },
    },
    warnings: {
      type: 'array',
      items: { type: 'string' },
    },
  },
};
