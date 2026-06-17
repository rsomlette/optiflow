import { Module } from '@nestjs/common';
import { LmStudioVisionClient } from './lm-studio-vision-client';
import { readVisionLlmConfig, VISION_LLM_CONFIG, type VisionLlmConfig } from './vision-llm.config';
import { VISION_LLM_CLIENT, type VisionLlmClient } from './vision-llm-client';

@Module({
  providers: [
    {
      provide: VISION_LLM_CONFIG,
      useFactory: readVisionLlmConfig,
    },
    {
      provide: VISION_LLM_CLIENT,
      useFactory: (config: VisionLlmConfig): VisionLlmClient => {
        if (config.provider === 'lmstudio') {
          return new LmStudioVisionClient(config);
        }

        throw new Error(`Unsupported vision LLM provider: ${config.provider}`);
      },
      inject: [VISION_LLM_CONFIG],
    },
  ],
  exports: [VISION_LLM_CLIENT],
})
export class VisionLlmModule {}
