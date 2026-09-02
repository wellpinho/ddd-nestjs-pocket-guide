import { OrderItem } from './order-item';

describe('OrderItem', () => {
  it('should calculate subtotal', () => {
    const item = new OrderItem({
      productId: 'product-1',
      name: 'Keyboard',
      priceInCents: 20_000,
      quantity: 2,
    });

    expect(item.getSubtotal().value).toBe(40_000);
  });

  it('should not accept zero quantity', () => {
    expect(
      () =>
        new OrderItem({
          productId: 'product-1',
          name: 'Keyboard',
          priceInCents: 20_000,
          quantity: 0,
        }),
    ).toThrow('Quantity must be a positive integer');
  });

  it('should not accept invalid price', () => {
    expect(
      () =>
        new OrderItem({
          productId: 'product-1',
          name: 'Keyboard',
          priceInCents: 0,
          quantity: 1,
        }),
    ).toThrow('Money must be greater than zero');
  });
});
