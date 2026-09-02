import { DomainError } from './domain-error';

export class PaymentFailedError extends DomainError {
  constructor() {
    super('Payment could not be completed');
  }
}
