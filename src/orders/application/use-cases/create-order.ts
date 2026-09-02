import { randomUUID } from 'crypto';
import { OrderRepository } from '../ports/order-repository';
import { Order } from '../../domain/order';
import { Injectable } from '@nestjs/common';

export interface CreateOrderInput {
  customerId: string;
  customerType: 'REGULAR' | 'PREMIUM';
  items: {
    productId: string;
    name: string;
    priceInCents: number;
    quantity: number;
  }[];
}

@Injectable()
export class CreateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(input: CreateOrderInput): Promise<Order> {
    const order = new Order({
      id: randomUUID(),
      customerId: input.customerId,
      customerType: input.customerType,
      items: input.items,
    });

    await this.orderRepository.save(order);

    return order;
  }
}
