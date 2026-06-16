import { Module } from '@nestjs/common';
import { OrderExtractionModule } from '../order-extraction/order-extraction.module';
import { NewOrderController } from './new-order.controller';
import { NewOrderService } from './new-order.service';

@Module({
  imports: [OrderExtractionModule],
  controllers: [NewOrderController],
  providers: [NewOrderService],
})
export class NewOrderModule {}
