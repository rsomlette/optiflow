import { Module } from '@nestjs/common';
import { VisionLlmModule } from '../vision-llm/vision-llm.module';
import { OrderExtractionService } from './order-extraction.service';

@Module({
  imports: [VisionLlmModule],
  providers: [OrderExtractionService],
  exports: [OrderExtractionService],
})
export class OrderExtractionModule {}
