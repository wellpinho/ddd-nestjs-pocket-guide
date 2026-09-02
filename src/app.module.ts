import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';

@Module({
  imports: [OrdersModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class AppModule {}
