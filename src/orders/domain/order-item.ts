import { Money } from './value-objects/money';

interface OrderItemProps {
  productId: string;
  name: string;
  priceInCents: number;
  quantity: number;
}

export class OrderItem {
  private readonly productId: string;
  private readonly name: string;
  private readonly price: Money;
  private readonly quantity: number;

  constructor(props: OrderItemProps) {
    if (!props.productId) {
      throw new Error('Product is required');
    }

    if (!props.name) {
      throw new Error('Product name is required');
    }

    if (!Number.isInteger(props.quantity) || props.quantity <= 0) {
      throw new Error('Quantity must be a positive integer');
    }

    this.productId = props.productId;
    this.name = props.name;
    this.price = Money.fromCents(props.priceInCents);
    this.quantity = props.quantity;
  }

  getProductId(): string {
    return this.productId;
  }

  getName(): string {
    return this.name;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getPriceInCents(): number {
    return this.price.value;
  }

  getSubtotal(): Money {
    return this.price.multiply(this.quantity);
  }
}
