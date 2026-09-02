import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../../application/ports/order-repository';
import { Order } from '../../domain/order';

@Injectable()
export class InMemoryOrderRepository implements OrderRepository {
  private readonly orders: Order[] = [];

  async save(order: Order): Promise<void> {
    const index = this.orders.findIndex((item) => item.id === order.id);

    if (index >= 0) {
      this.orders[index] = order;
      return;
    }

    this.orders.push(order);
  }

  async findById(id: string): Promise<Order | null> {
    return this.orders.find((order) => order.id === id) ?? null;
  }

  async findAll(): Promise<Order[]> {
    return [...this.orders];
  }
}
