import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../ports/order-repository';
import { Order } from '../../domain/order';

@Injectable()
export class PayOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new Error('Order not found');
    }

    order.pay();

    await this.orderRepository.save(order);

    return order;
  }
}
