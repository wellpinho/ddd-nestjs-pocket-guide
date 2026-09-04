import { DomainError } from './domain-error';

export class OrderCannotBeCancelledError extends DomainError {
  constructor() {
    super('Paid or processing order cannot be cancelled');
  }
}
