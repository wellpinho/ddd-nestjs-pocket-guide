import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../ports/order-repository';
import { Order } from '../../domain/order';
import { OrderNotFoundError } from '../../domain/errors';

@Injectable()
export class FindOrderByIdUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new OrderNotFoundError();
    }

    return order;
  }
}
