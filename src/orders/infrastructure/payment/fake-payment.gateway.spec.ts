import { FakePaymentGateway } from './fake-payment.gateway';

describe('FakePaymentGateway', () => {
  it('should return the same transaction for the same idempotency key', async () => {
    const gateway = new FakePaymentGateway();
    const input = {
      orderId: 'order-1',
      amountInCents: 10_000,
      idempotencyKey: 'pay-order:order-1',
    };

    const first = await gateway.charge(input);
    const second = await gateway.charge(input);

    expect(second.transactionId).toBe(first.transactionId);
  });
});
