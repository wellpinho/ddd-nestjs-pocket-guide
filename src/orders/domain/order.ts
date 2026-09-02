export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED';

export interface OrderItem {
  productId: string;
  name: string;
  priceInCents: number;
  quantity: number;
}

interface OrderProps {
  id: string;
  customerId: string;
  customerType: 'REGULAR' | 'PREMIUM';
  items: OrderItem[];
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

    let totalInCents = props.items.reduce(
      (total, item) => total + item.priceInCents * item.quantity,
      0,
    );

    if (props.customerType === 'PREMIUM' && totalInCents > 100_000) {
      totalInCents = Math.round(totalInCents * 0.9);
    }

    this.props = {
      id: props.id,
      customerId: props.customerId,
      customerType: props.customerType,
      items: props.items,
      totalInCents,
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
      throw new Error('Order is already paid');
    }

    if (this.props.status === 'CANCELLED') {
      throw new Error('Cancelled order cannot be paid');
    }

    this.props.status = 'PAID';
  }

  cancel(): void {
    if (this.props.status === 'PAID') {
      throw new Error('Paid order cannot be cancelled');
    }

    this.props.status = 'CANCELLED';
  }
}
