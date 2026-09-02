import { randomUUID } from 'crypto';
import { Order } from '../../domain/order';

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

export class CreateOrderUseCase {
  execute(input: CreateOrderInput): Order {
    return new Order({
      id: randomUUID(),
      customerId: input.customerId,
      customerType: input.customerType,
      items: input.items,
    });
  }
}
