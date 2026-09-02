import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../ports/order-repository';
import { Order } from '../../domain/order';
import { PaymentGateway } from '../ports/payment-gateway';
import { OrderNotFoundError } from './../../domain/errors';

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

    await this.paymentGateway.charge({
      orderId: order.id,
      amountInCents: order.totalInCents,
    });

    order.pay();

    await this.orderRepository.save(order);

    return order;
  }
}
