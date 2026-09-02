import { Money } from './money';

describe('Money', () => {
  it('should create money from cents', () => {
    const money = Money.fromCents(10_000);

    expect(money.value).toBe(10_000);
  });

  it('should not create money with zero value', () => {
    expect(() => Money.fromCents(0)).toThrow('Money must be greater than zero');
  });

  it('should not create money with negative value', () => {
    expect(() => Money.fromCents(-100)).toThrow(
      'Money must be greater than zero',
    );
  });

  it('should multiply money by quantity', () => {
    const money = Money.fromCents(10_000);

    const result = money.multiply(3);

    expect(result.value).toBe(30_000);
  });

  it('should add two monetary values', () => {
    const first = Money.fromCents(10_000);
    const second = Money.fromCents(5_000);

    const result = first.add(second);

    expect(result.value).toBe(15_000);
  });

  it('should apply a percentage discount', () => {
    const money = Money.fromCents(120_000);

    const result = money.applyPercentageDiscount(10);

    expect(result.value).toBe(108_000);
  });
});
