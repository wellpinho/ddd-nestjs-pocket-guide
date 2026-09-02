import { DomainError } from './domain-error';

export class OrderNotFoundError extends DomainError {
  constructor() {
    super('Order not found');
  }
}
