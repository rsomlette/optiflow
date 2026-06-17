import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { NewOrderModule } from './new-order/new-order.module';

@Module({
  imports: [NewOrderModule],
  controllers: [HealthController],
})
export class AppModule {}
