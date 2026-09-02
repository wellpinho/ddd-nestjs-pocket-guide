import { DomainError } from './domain-error';

export class OrderCancelledError extends DomainError {
  constructor() {
    super('Cancelled order cannot be paid');
  }
}
