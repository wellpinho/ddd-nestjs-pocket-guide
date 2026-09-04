import { DomainError } from './domain-error';

export class OrderPaymentProcessingError extends DomainError {
  constructor() {
    super('Order payment is already being processed');
  }
}
