import { type INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import sharp from 'sharp';
import { type App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/main';
import { VISION_LLM_CLIENT, type VisionLlmClient } from '../src/vision-llm/vision-llm-client';

interface NewOrderResponseBody {
  client: { fullName: { value: string | null } };
  barcodes: { reception: { digits: string | null } };
}

describe('NewOrderController (e2e)', () => {
  let app: INestApplication<App>;
  const visionLlm: VisionLlmClient = {
    requestJson: jest.fn().mockResolvedValue(validLlmResponse()),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(VISION_LLM_CLIENT)
      .useValue(visionLlm)
      .compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/new (POST) extracts a French optical order image', async () => {
    await request(app.getHttpServer())
      .post('/new')
      .attach('file', await validPngBuffer(), { filename: 'order.png', contentType: 'image/png' })
      .expect(200)
      .expect((response) => {
        const body = response.body as NewOrderResponseBody;

        expect(body.client.fullName.value).toBe('Jean Dupont');
        expect(body.barcodes.reception.digits).toBe('1234567890123');
      });
  });

  it('/new (POST) rejects requests without an image file', async () => {
    await request(app.getHttpServer()).post('/new').expect(400);
  });
});

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
    items: [],
    barcodes: {
      reception: { label: 'Réception', rawText: '*1234567890123AB*', digits: null, suffix: null, confidence: 'high' },
      centrage: { label: 'Centrage', rawText: null, digits: null, suffix: null, confidence: 'low' },
      montage: { label: 'Montage', rawText: null, digits: null, suffix: null, confidence: 'low' },
      verification: { label: 'Vérification', rawText: null, digits: null, suffix: null, confidence: 'low' },
    },
    warnings: [],
  };
}
