import { DomainEvent } from './domain-event';

export class OrderPaidEvent implements DomainEvent {
  readonly eventName = 'order.paid';
  readonly occurredAt: Date;

  constructor(
    readonly orderId: string,
    readonly amountInCents: number,
    readonly transactionId: string,
    occurredAt?: Date,
  ) {
    this.occurredAt = occurredAt ?? new Date();
  }
}
