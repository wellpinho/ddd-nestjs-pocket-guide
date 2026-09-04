import {
  OrderAlreadyPaidError,
  OrderCancelledError,
  OrderCannotBeCancelledError,
  OrderPaymentProcessingError,
  DomainValidationError,
} from './errors';
import { DomainEvent } from './events/domain-event';
import { OrderPaidEvent } from './events/order-paid.event';
import { OrderItem } from './order-item';
import { PricingPolicy } from './services/pricing-policy';

export type OrderStatus =
  | 'PENDING'
  | 'PAYMENT_PROCESSING'
  | 'PAID'
  | 'CANCELLED';

export interface OrderItemInput {
  productId: string;
  name: string;
  priceInCents: number;
  quantity: number;
}

interface OrderProps {
  id: string;
  customerId: string;
  customerType: 'REGULAR' | 'PREMIUM';
  items: OrderItemInput[];
  status?: OrderStatus;
  createdAt?: Date;
  paymentTransactionId?: string;
}

export class Order {
  private readonly domainEvents: DomainEvent[] = [];

  private props: {
    id: string;
    customerId: string;
    customerType: 'REGULAR' | 'PREMIUM';
    items: OrderItem[];
    totalInCents: number;
    status: OrderStatus;
    createdAt: Date;
    paymentTransactionId?: string;
  };

  constructor(props: OrderProps) {
    if (!props.customerId) throw new DomainValidationError('Customer is required');
    if (!props.items?.length) throw new DomainValidationError('Order must have at least one item');

    const items = props.items.map((item) => new OrderItem(item));
    const subtotal = items
      .map((item) => item.getSubtotal())
      .reduce((total, itemSubtotal) => total.add(itemSubtotal));

    const total = new PricingPolicy().calculateTotal(subtotal, props.customerType);

    this.props = {
      id: props.id,
      customerId: props.customerId,
      customerType: props.customerType,
      items,
      totalInCents: total.value,
      status: props.status ?? 'PENDING',
      createdAt: props.createdAt ?? new Date(),
      paymentTransactionId: props.paymentTransactionId,
    };
  }

  get id(): string { return this.props.id; }
  get customerId(): string { return this.props.customerId; }
  get customerType(): 'REGULAR' | 'PREMIUM' { return this.props.customerType; }
  get items(): OrderItem[] { return [...this.props.items]; }
  get totalInCents(): number { return this.props.totalInCents; }
  get status(): OrderStatus { return this.props.status; }
  get createdAt(): Date { return this.props.createdAt; }
  get paymentTransactionId(): string | undefined { return this.props.paymentTransactionId; }

  startPayment(): void {
    if (this.props.status === 'PAID') throw new OrderAlreadyPaidError();
    if (this.props.status === 'CANCELLED') throw new OrderCancelledError();
    if (this.props.status === 'PAYMENT_PROCESSING') {
      throw new OrderPaymentProcessingError();
    }

    this.props.status = 'PAYMENT_PROCESSING';
  }

  confirmPayment(transactionId: string): void {
    if (this.props.status === 'PAID') throw new OrderAlreadyPaidError();
    if (this.props.status === 'CANCELLED') throw new OrderCancelledError();
    if (this.props.status !== 'PAYMENT_PROCESSING') {
      throw new DomainValidationError('Payment must be processing before confirmation');
    }

    this.props.status = 'PAID';
    this.props.paymentTransactionId = transactionId;
    this.domainEvents.push(
      new OrderPaidEvent(this.id, this.totalInCents, transactionId),
    );
  }

  failPayment(): void {
    if (this.props.status === 'PAYMENT_PROCESSING') {
      this.props.status = 'PENDING';
    }
  }

  cancel(): void {
    if (this.props.status === 'PAID' || this.props.status === 'PAYMENT_PROCESSING') {
      throw new OrderCannotBeCancelledError();
    }
    this.props.status = 'CANCELLED';
  }

  pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents.length = 0;
    return events;
  }
}
