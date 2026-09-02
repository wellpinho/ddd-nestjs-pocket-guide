import { InMemoryOrderRepository } from './../../infrastructure/repositories/in-memory-order.repository';
import {
  PaymentGateway,
  PaymentInput,
  PaymentResult,
} from '../ports/payment-gateway';
import { PayOrderUseCase } from './pay-order';
import { Order } from './../../domain/order';

class PaymentGatewayStub implements PaymentGateway {
  payments: PaymentInput[] = [];

  async charge(input: PaymentInput): Promise<PaymentResult> {
    this.payments.push(input);

    return {
      transactionId: 'transaction-123',
    };
  }
}

describe('PayOrderUseCase', () => {
  let repository: InMemoryOrderRepository;
  let paymentGateway: PaymentGatewayStub;
  let useCase: PayOrderUseCase;

  beforeEach(() => {
    repository = new InMemoryOrderRepository();
    paymentGateway = new PaymentGatewayStub();

    useCase = new PayOrderUseCase(repository, paymentGateway);
  });

  it('should charge payment and mark order as paid', async () => {
    const order = new Order({
      id: 'order-1',
      customerId: 'customer-1',
      customerType: 'REGULAR',
      items: [
        {
          productId: 'product-1',
          name: 'Keyboard',
          priceInCents: 10_000,
          quantity: 2,
        },
      ],
    });

    await repository.save(order);

    const result = await useCase.execute(order.id);

    expect(result.status).toBe('PAID');

    expect(paymentGateway.payments).toHaveLength(1);

    expect(paymentGateway.payments[0]).toEqual({
      orderId: 'order-1',
      amountInCents: 20_000,
    });
  });
});
