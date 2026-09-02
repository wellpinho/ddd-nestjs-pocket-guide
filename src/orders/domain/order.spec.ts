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
    const order = makeOrder();

    expect(order.status).toBe('PENDING');
  });

  it('should pay a pending order', () => {
    const order = makeOrder();

    order.pay();

    expect(order.status).toBe('PAID');
  });

  it('should not pay an already paid order', () => {
    const order = makeOrder();

    order.pay();

    expect(() => order.pay()).toThrow('Order is already paid');
  });

  it('should not pay a cancelled order', () => {
    const order = makeOrder();

    order.cancel();

    expect(() => order.pay()).toThrow('Cancelled order cannot be paid');
  });

  it('should cancel a pending order', () => {
    const order = makeOrder();

    order.cancel();

    expect(order.status).toBe('CANCELLED');
  });

  it('should not cancel a paid order', () => {
    const order = makeOrder();

    order.pay();

    expect(() => order.cancel()).toThrow('Paid order cannot be cancelled');
  });

  it('should calculate the order total', () => {
    const order = new Order({
      id: 'order-1',
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

    expect(order.totalInCents).toBe(20_000);
  });

  it('should apply premium discount', () => {
    const order = new Order({
      id: 'order-1',
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
