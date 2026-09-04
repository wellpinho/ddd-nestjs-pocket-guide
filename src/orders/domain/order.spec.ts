import {
  OrderAlreadyPaidError,
  OrderCancelledError,
  OrderCannotBeCancelledError,
} from './errors';
import { OrderPaidEvent } from './events/order-paid.event';
import { Order } from './order';

describe('Order', () => {
  function makeOrder() {
    return new Order({
      id: 'order-1',
      customerId: 'customer-1',
      customerType: 'REGULAR',
      items: [
        {
          productId: 'product-1',
          name: 'Monitor',
          priceInCents: 90_000,
          quantity: 1,
        },
      ],
    });
  }

  it('should create an order as pending', () => {
    expect(makeOrder().status).toBe('PENDING');
  });

  it('should move from pending to processing and then paid', () => {
    const order = makeOrder();
    order.startPayment();
    expect(order.status).toBe('PAYMENT_PROCESSING');

    order.confirmPayment('tx-1');
    expect(order.status).toBe('PAID');
    expect(order.paymentTransactionId).toBe('tx-1');
  });

  it('should register OrderPaid domain event after payment confirmation', () => {
    const order = makeOrder();
    order.startPayment();
    order.confirmPayment('tx-1');

    const events = order.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(OrderPaidEvent);
  });

  it('should not start payment for an already paid order', () => {
    const order = makeOrder();
    order.startPayment();
    order.confirmPayment('tx-1');
    expect(() => order.startPayment()).toThrow(OrderAlreadyPaidError);
  });

  it('should not start payment for a cancelled order', () => {
    const order = makeOrder();
    order.cancel();
    expect(() => order.startPayment()).toThrow(OrderCancelledError);
  });

  it('should return to pending when payment fails', () => {
    const order = makeOrder();
    order.startPayment();
    order.failPayment();
    expect(order.status).toBe('PENDING');
  });

  it('should cancel a pending order', () => {
    const order = makeOrder();
    order.cancel();
    expect(order.status).toBe('CANCELLED');
  });

  it('should not cancel a paid order', () => {
    const order = makeOrder();
    order.startPayment();
    order.confirmPayment('tx-1');
    expect(() => order.cancel()).toThrow(OrderCannotBeCancelledError);
  });

  it('should calculate the order total', () => {
    const order = new Order({
      id: 'order-1',
      customerId: 'customer-1',
      customerType: 'REGULAR',
      items: [{ productId: 'product-1', name: 'Mouse', priceInCents: 10_000, quantity: 2 }],
    });
    expect(order.totalInCents).toBe(20_000);
  });

  it('should apply premium discount', () => {
    const order = new Order({
      id: 'order-1',
      customerId: 'customer-1',
      customerType: 'PREMIUM',
      items: [{ productId: 'product-1', name: 'Keyboard', priceInCents: 60_000, quantity: 2 }],
    });
    expect(order.totalInCents).toBe(108_000);
  });
});
