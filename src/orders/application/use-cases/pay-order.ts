import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../ports/order-repository';
import { Order } from '../../domain/order';
import { PaymentGateway } from '../ports/payment-gateway';
import { OrderNotFoundError } from './../../domain/errors';
import { PaymentFailedError } from '../../domain/errors/payment-failed.error';

@Injectable()
export class PayOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly paymentGateway: PaymentGateway,
  ) {}

  async execute(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new OrderNotFoundError();
    }

    try {
      await this.paymentGateway.charge({
        orderId: order.id,
        amountInCents: order.totalInCents,
        idempotencyKey: `pay-order:${order.id}`,
      });
    } catch {
      throw new PaymentFailedError();
    }

    order.pay();

    await this.orderRepository.save(order);

    return order;
  }
}
