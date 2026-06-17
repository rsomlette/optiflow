import { type Buffer } from 'node:buffer';

export const VISION_LLM_CLIENT = Symbol('VISION_LLM_CLIENT');

export interface VisionLlmImageRequest {
  prompt: string;
  responseSchema?: Record<string, unknown>;
  image: {
    buffer: Buffer;
    mimeType: string;
  };
  temperature?: number;
}

export interface VisionLlmClient {
  requestJson(request: VisionLlmImageRequest): Promise<unknown>;
}
