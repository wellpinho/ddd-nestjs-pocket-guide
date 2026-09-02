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
  totalInCents: number;
  status: OrderStatus;
  createdAt: Date;
}

export class Order {
  private props: OrderProps;

  constructor(props: OrderProps) {
    this.props = props;
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
