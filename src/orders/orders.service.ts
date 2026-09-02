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
    try {
      const order = new Order({
        id: randomUUID(),
        customerId: input.customerId,
        customerType: input.customerType,
        items: input.items,
      });

      this.orders.push(order);

      return order;
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
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
