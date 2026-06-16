export const VISION_LLM_CONFIG = Symbol('VISION_LLM_CONFIG');

export interface VisionLlmConfig {
  provider: string;
  baseUrl: string;
  model: string;
  apiKey: string | null;
  timeoutMs: number;
  maxTokens: number;
}

const DEFAULT_TIMEOUT_MS = 120_000;
const DEFAULT_MAX_TOKENS = 1_800;

export function readVisionLlmConfig(): VisionLlmConfig {
  return {
    provider: process.env.VISION_LLM_PROVIDER ?? 'lmstudio',
    baseUrl: process.env.VISION_LLM_BASE_URL ?? 'http://localhost:1234/v1',
    model: process.env.VISION_LLM_MODEL ?? 'qwen/qwen3-vl-30b',
    apiKey: process.env.VISION_LLM_API_KEY ?? null,
    timeoutMs: process.env.VISION_LLM_TIMEOUT_MS
      ? Number(process.env.VISION_LLM_TIMEOUT_MS)
      : DEFAULT_TIMEOUT_MS,
    maxTokens: process.env.VISION_LLM_MAX_TOKENS ? Number(process.env.VISION_LLM_MAX_TOKENS) : DEFAULT_MAX_TOKENS,
  };
}
