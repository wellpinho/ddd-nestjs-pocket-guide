import { DomainError } from './domain-error';

export class OrderCannotBeCancelledError extends DomainError {
  constructor() {
    super('Paid order cannot be cancelled');
  }
}
