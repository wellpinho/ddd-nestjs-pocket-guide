export class CreateOrderItemDto {
  productId!: string;
  name!: string;
  priceInCents!: number;
  quantity!: number;
}

export class CreateOrderDto {
  customerId!: string;
  customerType!: 'REGULAR' | 'PREMIUM';
  items!: CreateOrderItemDto[];
}
