import { DomainError } from './domain-error';

export class OrderAlreadyPaidError extends DomainError {
  constructor() {
    super('Order is already paid');
  }
}
