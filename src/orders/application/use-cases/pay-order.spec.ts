import { PaymentFailedError } from '../../domain/errors';
import { Order } from '../../domain/order';
import { InMemoryOutboxRepository } from '../../infrastructure/messaging/in-memory-outbox.repository';
import { InMemoryOrderRepository } from '../../infrastructure/repositories/in-memory-order.repository';
import { PaymentGateway, PaymentInput, PaymentResult } from '../ports/payment-gateway';
import { PayOrderUseCase } from './pay-order';

class PaymentGatewayStub implements PaymentGateway {
  payments: PaymentInput[] = [];

  async charge(input: PaymentInput): Promise<PaymentResult> {
    this.payments.push(input);
    return { transactionId: 'transaction-123' };
  }
}

class FailingPaymentGateway implements PaymentGateway {
  async charge(): Promise<PaymentResult> {
    throw new Error('Gateway unavailable');
  }
}

describe('PayOrderUseCase', () => {
  const makeOrder = () => new Order({
    id: 'order-1',
    customerId: 'customer-1',
    customerType: 'REGULAR',
    items: [{ productId: 'product-1', name: 'Keyboard', priceInCents: 10_000, quantity: 2 }],
  });

  it('should charge payment, mark order as paid and add integration event to outbox', async () => {
    const repository = new InMemoryOrderRepository();
    const gateway = new PaymentGatewayStub();
    const outbox = new InMemoryOutboxRepository();
    const useCase = new PayOrderUseCase(repository, gateway, outbox);
    const order = makeOrder();
    await repository.save(order);

    const result = await useCase.execute(order.id);

    expect(result.status).toBe('PAID');
    expect(result.paymentTransactionId).toBe('transaction-123');
    expect(gateway.payments[0]).toEqual({
      orderId: 'order-1',
      amountInCents: 20_000,
      idempotencyKey: 'pay-order:order-1',
    });

    const messages = await outbox.pending();
    expect(messages).toHaveLength(1);
    expect(messages[0].event.eventName).toBe('orders.order-paid.v1');
    expect(messages[0].event.payload.orderId).toBe('order-1');
  });

  it('should return order to pending when payment gateway fails', async () => {
    const repository = new InMemoryOrderRepository();
    const outbox = new InMemoryOutboxRepository();
    const useCase = new PayOrderUseCase(repository, new FailingPaymentGateway(), outbox);
    const order = makeOrder();
    await repository.save(order);

    await expect(useCase.execute(order.id)).rejects.toThrow(PaymentFailedError);
    expect((await repository.findById(order.id))?.status).toBe('PENDING');
    expect(await outbox.pending()).toHaveLength(0);
  });
});
