import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should create a pending order with the correct total', () => {
    const result = service.create({
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

    expect(result.status).toBe('PENDING');
    expect(result.totalInCents).toBe(20_000);
    expect(result.customerId).toBe('customer-1');
    expect(result.items).toHaveLength(1);
  });

  it('should apply 10% discount for premium customers when total is greater than 100000 cents', () => {
    const result = service.create({
      customerId: 'customer-1',
      customerType: 'PREMIUM',
      items: [
        {
          productId: 'product-1',
          name: 'Mechanical Keyboard',
          priceInCents: 60_000,
          quantity: 2,
        },
      ],
    });

    expect(result.totalInCents).toBe(108_000);
  });

  it('should not apply discount for regular customers', () => {
    const result = service.create({
      customerId: 'customer-1',
      customerType: 'REGULAR',
      items: [
        {
          productId: 'product-1',
          name: 'Mechanical Keyboard',
          priceInCents: 60_000,
          quantity: 2,
        },
      ],
    });

    expect(result.totalInCents).toBe(120_000);
  });

  it('should not apply premium discount when total is exactly 100000 cents', () => {
    const result = service.create({
      customerId: 'customer-1',
      customerType: 'PREMIUM',
      items: [
        {
          productId: 'product-1',
          name: 'Monitor',
          priceInCents: 100_000,
          quantity: 1,
        },
      ],
    });

    expect(result.totalInCents).toBe(100_000);
  });

  it('should reject an order without items', () => {
    expect(() =>
      service.create({
        customerId: 'customer-1',
        customerType: 'REGULAR',
        items: [],
      }),
    ).toThrow(BadRequestException);
  });

  it('should reject items with quantity less than or equal to zero', () => {
    expect(() =>
      service.create({
        customerId: 'customer-1',
        customerType: 'REGULAR',
        items: [
          {
            productId: 'product-1',
            name: 'Mouse',
            priceInCents: 10_000,
            quantity: 0,
          },
        ],
      }),
    ).toThrow(BadRequestException);
  });

  it('should pay a pending order', () => {
    const order = service.create({
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

    const result = service.pay(order.id);

    expect(result.status).toBe('PAID');
  });

  it('should not pay an already paid order', () => {
    const order = service.create({
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

    service.pay(order.id);

    expect(() => service.pay(order.id)).toThrow(BadRequestException);
  });

  it('should not pay a cancelled order', () => {
    const order = service.create({
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

    service.cancel(order.id);

    expect(() => service.pay(order.id)).toThrow(BadRequestException);
  });

  it('should not cancel a paid order', () => {
    const order = service.create({
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

    service.pay(order.id);

    expect(() => service.cancel(order.id)).toThrow(BadRequestException);
  });
});
