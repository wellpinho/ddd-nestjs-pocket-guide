import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../ports/order-repository';
import { Order } from '../../domain/order';
import { OrderNotFoundError } from 'src/orders/domain/errors';

@Injectable()
export class PayOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new OrderNotFoundError();
    }

    order.pay();

    await this.orderRepository.save(order);

    return order;
  }
}
