import { Inject, Injectable } from '@nestjs/common';
import { ORDER_EXTRACTION_PROMPT } from './order-extraction.prompt';
import { ORDER_EXTRACTION_RESPONSE_SCHEMA } from './order-extraction.response-schema';
import { parseOrderExtractionResult } from './order-extraction.schema';
import { type OrderExtractionResult } from './order-extraction.types';
import { VISION_LLM_CLIENT, type VisionLlmClient } from '../vision-llm/vision-llm-client';

interface ExtractOrderInput {
  buffer: Buffer;
  mimeType: string;
}

@Injectable()
export class OrderExtractionService {
  constructor(@Inject(VISION_LLM_CLIENT) private readonly visionLlm: VisionLlmClient) {}

  public async extractFromImage(input: ExtractOrderInput): Promise<OrderExtractionResult> {
    const response = await this.visionLlm.requestJson({
      prompt: ORDER_EXTRACTION_PROMPT,
      responseSchema: ORDER_EXTRACTION_RESPONSE_SCHEMA,
      image: {
        buffer: input.buffer,
        mimeType: input.mimeType,
      },
    });

    return parseOrderExtractionResult(response);
  }
}
