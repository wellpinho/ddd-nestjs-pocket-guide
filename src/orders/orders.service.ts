import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Order } from './domain/order';
import {
  CreateOrderInput,
  CreateOrderUseCase,
} from './application/use-cases/create-order';

@Injectable()
export class OrdersService {
  private readonly orders: Order[] = [];

  create(input: CreateOrderInput): Order {
    try {
      const useCase = new CreateOrderUseCase();

      const order = useCase.execute(input);

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
