import { CreateOrderUseCase } from './create-order';
import { InMemoryOrderRepository } from '../../infrastructure/repositories/in-memory-order.repository';

describe('CreateOrderUseCase', () => {
  let repository: InMemoryOrderRepository;
  let useCase: CreateOrderUseCase;

  beforeEach(() => {
    repository = new InMemoryOrderRepository();
    useCase = new CreateOrderUseCase(repository);
  });

  it('should create and persist an order', async () => {
    const order = await useCase.execute({
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

    const persistedOrder = await repository.findById(order.id);

    expect(order.status).toBe('PENDING');
    expect(order.totalInCents).toBe(20_000);

    expect(persistedOrder).not.toBeNull();
    expect(persistedOrder?.id).toBe(order.id);
  });

  it('should apply premium pricing rules', async () => {
    const order = await useCase.execute({
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
