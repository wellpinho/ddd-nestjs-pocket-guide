export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED';

export interface OrderItem {
  productId: string;
  name: string;
  priceInCents: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerType: 'REGULAR' | 'PREMIUM';
  items: OrderItem[];
  totalInCents: number;
  status: OrderStatus;
  createdAt: Date;
}
