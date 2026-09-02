import { CreateOrderUseCase } from './create-order';

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;

  beforeEach(() => {
    useCase = new CreateOrderUseCase();
  });

  it('should create an order', () => {
    const order = useCase.execute({
      customerId: 'customer-1',
      customerType: 'REGULAR',
      items: [
        {
          productId: 'product-1',
          name: 'Mouse',
          priceInCents: 10_000,
          quantity: 2,
        },
      ],
    });

    expect(order.customerId).toBe('customer-1');
    expect(order.status).toBe('PENDING');
    expect(order.totalInCents).toBe(20_000);
  });

  it('should apply premium pricing rules through the domain', () => {
    const order = useCase.execute({
      customerId: 'customer-1',
      customerType: 'PREMIUM',
      items: [
        {
          productId: 'product-1',
          name: 'Keyboard',
          priceInCents: 60_000,
          quantity: 2,
        },
      ],
    });

    expect(order.totalInCents).toBe(108_000);
  });
});
