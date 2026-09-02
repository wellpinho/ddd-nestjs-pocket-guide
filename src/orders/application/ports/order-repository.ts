import { Order } from '../../domain/order';

export abstract class OrderRepository {
  abstract save(order: Order): Promise<void>;

  abstract findById(id: string): Promise<Order | null>;

  abstract findAll(): Promise<Order[]>;
}
