import { DomainValidationError } from '../errors';

export class Money {
  private constructor(private readonly valueInCents: number) {
    if (!Number.isInteger(valueInCents)) {
      throw new DomainValidationError('Money must be represented in cents');
    }
    if (valueInCents <= 0) {
      throw new DomainValidationError('Money must be greater than zero');
    }
  }

  static fromCents(valueInCents: number): Money {
    return new Money(valueInCents);
  }

  get value(): number { return this.valueInCents; }

  multiply(quantity: number): Money {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new DomainValidationError('Quantity must be a positive integer');
    }
    return Money.fromCents(this.valueInCents * quantity);
  }

  add(other: Money): Money {
    return Money.fromCents(this.valueInCents + other.valueInCents);
  }

  applyPercentageDiscount(percentage: number): Money {
    if (percentage < 0 || percentage >= 100) {
      throw new DomainValidationError(
        'Discount percentage must be greater than or equal to 0 and lower than 100',
      );
    }
    return Money.fromCents(
      Math.round(this.valueInCents * (1 - percentage / 100)),
    );
  }
}
