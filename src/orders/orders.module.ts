import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import {
  CancelOrderUseCase,
  CreateOrderUseCase,
  FindOrderByIdUseCase,
  FindOrdersUseCase,
  PayOrderUseCase,
  ProcessOutboxUseCase,
} from './application/use-cases';
import {
  EventPublisher,
  OrderRepository,
  OutboxRepository,
  PaymentGateway,
} from './application/ports';
import { InMemoryOrderRepository } from './infrastructure/repositories/in-memory-order.repository';
import { FakePaymentGateway } from './infrastructure/payment/fake-payment.gateway';
import { InMemoryOutboxRepository } from './infrastructure/messaging/in-memory-outbox.repository';
import { InMemoryEventPublisher } from './infrastructure/messaging/in-memory-event.publisher';

@Module({
  controllers: [OrdersController],
  providers: [
    CreateOrderUseCase,
    FindOrdersUseCase,
    FindOrderByIdUseCase,
    PayOrderUseCase,
    CancelOrderUseCase,
    ProcessOutboxUseCase,
    { provide: OrderRepository, useClass: InMemoryOrderRepository },
    { provide: PaymentGateway, useClass: FakePaymentGateway },
    { provide: OutboxRepository, useClass: InMemoryOutboxRepository },
    { provide: EventPublisher, useClass: InMemoryEventPublisher },
  ],
})
export class OrdersModule {}
