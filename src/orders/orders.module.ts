import { Module } from '@nestjs/common';

import { OrdersController } from './orders.controller';

import { CreateOrderUseCase } from './application/use-cases/create-order';
import { FindOrdersUseCase } from './application/use-cases/find-orders';
import { FindOrderByIdUseCase } from './application/use-cases/find-order-by-id';
import { PayOrderUseCase } from './application/use-cases/pay-order';
import { CancelOrderUseCase } from './application/use-cases/cancel-order';

import { OrderRepository } from './application/ports/order-repository';
import { InMemoryOrderRepository } from './infrastructure/repositories/in-memory-order.repository';
import { PaymentGateway } from './application/ports/payment-gateway';
import { FakePaymentGateway } from './infrastructure/repositories/payment/fake-payment.gateway';

@Module({
  controllers: [OrdersController],

  providers: [
    CreateOrderUseCase,
    FindOrdersUseCase,
    FindOrderByIdUseCase,
    PayOrderUseCase,
    CancelOrderUseCase,
    {
      provide: PaymentGateway,
      useClass: FakePaymentGateway,
    },
    {
      provide: OrderRepository,
      useClass: InMemoryOrderRepository,
    },
  ],
})
export class OrdersModule {}
