export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED';
import {
  OrderAlreadyPaidError,
  OrderCancelledError,
  OrderCannotBeCancelledError,
} from './errors';
import { OrderItem } from './order-item';
import { PricingPolicy } from './services/pricing-policy';

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
}

export class Order {
  private props: {
    id: string;
    customerId: string;
    customerType: 'REGULAR' | 'PREMIUM';
    items: OrderItem[];
    totalInCents: number;
    status: OrderStatus;
    createdAt: Date;
  };

  constructor(props: OrderProps) {
    if (!props.customerId) {
      throw new Error('Customer is required');
    }

    if (!props.items || props.items.length === 0) {
      throw new Error('Order must have at least one item');
    }

    for (const item of props.items) {
      if (item.quantity <= 0) {
        throw new Error('Item quantity must be greater than zero');
      }

      if (item.priceInCents <= 0) {
        throw new Error('Item price must be greater than zero');
      }
    }

    const items = props.items.map((item) => new OrderItem(item));

    const subtotal = items
      .map((item) => item.getSubtotal())
      .reduce((total, itemSubtotal) => total.add(itemSubtotal));

    const pricingPolicy = new PricingPolicy();
    const total = pricingPolicy.calculateTotal(subtotal, props.customerType);

    this.props = {
      id: props.id,
      customerId: props.customerId,
      customerType: props.customerType,
      items,
      totalInCents: total.value,
      status: props.status ?? 'PENDING',
      createdAt: props.createdAt ?? new Date(),
    };
  }

  get id(): string {
    return this.props.id;
  }

  get customerId(): string {
    return this.props.customerId;
  }

  get customerType(): 'REGULAR' | 'PREMIUM' {
    return this.props.customerType;
  }

  get items(): OrderItem[] {
    return this.props.items;
  }

  get totalInCents(): number {
    return this.props.totalInCents;
  }

  get status(): OrderStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  pay(): void {
    if (this.props.status === 'PAID') {
      throw new OrderAlreadyPaidError();
    }

    if (this.props.status === 'CANCELLED') {
      throw new OrderCancelledError();
    }

    this.props.status = 'PAID';
  }

  cancel(): void {
    if (this.props.status === 'PAID') {
      throw new OrderCannotBeCancelledError();
    }

    this.props.status = 'CANCELLED';
  }
}
