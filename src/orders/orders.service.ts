import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Order } from './domain/order';

interface CreateOrderInput {
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
export class OrdersService {
  private readonly orders: Order[] = [];

  create(input: CreateOrderInput): Order {
    if (!input.customerId) {
      throw new BadRequestException('Customer is required');
    }

    if (!input.items || input.items.length === 0) {
      throw new BadRequestException('Order must have at least one item');
    }

    let totalInCents = 0;

    for (const item of input.items) {
      if (item.quantity <= 0) {
        throw new BadRequestException(
          'Item quantity must be greater than zero',
        );
      }

      if (item.priceInCents <= 0) {
        throw new BadRequestException('Item price must be greater than zero');
      }

      totalInCents += item.priceInCents * item.quantity;
    }

    if (input.customerType === 'PREMIUM' && totalInCents > 100_000) {
      totalInCents = Math.round(totalInCents * 0.9);
    }

    const order = new Order({
      id: randomUUID(),
      customerId: input.customerId,
      customerType: input.customerType,
      items: input.items,
      totalInCents,
      status: 'PENDING',
      createdAt: new Date(),
    });

    this.orders.push(order);

    return order;
  }

  findAll(): Order[] {
    return this.orders;
  }

  findById(id: string): Order {
    const order = this.orders.find((item) => item.id === id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  pay(id: string): Order {
    const order = this.findById(id);

    try {
      order.pay();
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }

    return order;
  }

  cancel(id: string): Order {
    const order = this.findById(id);

    try {
      order.cancel();
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }

    return order;
  }
}
