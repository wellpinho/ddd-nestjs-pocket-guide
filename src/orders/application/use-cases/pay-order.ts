import { Injectable } from '@nestjs/common';
import { Order } from '../../domain/order';
import { OrderNotFoundError, PaymentFailedError } from '../../domain/errors';
import { OrderPaidEvent } from '../../domain/events/order-paid.event';
import { OrderRepository } from '../ports/order-repository';
import { PaymentGateway } from '../ports/payment-gateway';
import { OutboxRepository } from '../ports/outbox-repository';
import { randomUUID } from 'crypto';

@Injectable()
export class PayOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly paymentGateway: PaymentGateway,
    private readonly outboxRepository: OutboxRepository,
  ) {}

  async execute(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new OrderNotFoundError();

    order.startPayment();
    await this.orderRepository.save(order);

    let transactionId: string;
    try {
      const result = await this.paymentGateway.charge({
        orderId: order.id,
        amountInCents: order.totalInCents,
        idempotencyKey: `pay-order:${order.id}`,
      });
      transactionId = result.transactionId;
    } catch {
      order.failPayment();
      await this.orderRepository.save(order);
      throw new PaymentFailedError();
    }

    order.confirmPayment(transactionId);
    await this.orderRepository.save(order);

    for (const event of order.pullDomainEvents()) {
      if (event instanceof OrderPaidEvent) {
        await this.outboxRepository.add({
          id: randomUUID(),
          attempts: 0,
          event: {
            eventName: 'orders.order-paid.v1',
            occurredAt: event.occurredAt,
            payload: {
              orderId: event.orderId,
              amountInCents: event.amountInCents,
              transactionId: event.transactionId,
            },
          },
        });
      }
    }

    return order;
  }
}
