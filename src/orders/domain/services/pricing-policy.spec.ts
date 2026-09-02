import { PricingPolicy } from './pricing-policy';
import { Money } from '../value-objects/money';

describe('PricingPolicy', () => {
  let policy: PricingPolicy;

  beforeEach(() => {
    policy = new PricingPolicy();
  });

  it('should apply 10% discount for premium customers above 100000 cents', () => {
    const subtotal = Money.fromCents(120_000);

    const total = policy.calculateTotal(subtotal, 'PREMIUM');

    expect(total.value).toBe(108_000);
  });

  it('should not apply discount for regular customers', () => {
    const subtotal = Money.fromCents(120_000);

    const total = policy.calculateTotal(subtotal, 'REGULAR');

    expect(total.value).toBe(120_000);
  });

  it('should not apply discount when premium total is exactly 100000 cents', () => {
    const subtotal = Money.fromCents(100_000);

    const total = policy.calculateTotal(subtotal, 'PREMIUM');

    expect(total.value).toBe(100_000);
  });
});
