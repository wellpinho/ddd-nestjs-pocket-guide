import { Money } from '../value-objects/money';

export type CustomerType = 'REGULAR' | 'PREMIUM';

export class PricingPolicy {
  calculateTotal(subtotal: Money, customerType: CustomerType): Money {
    if (customerType === 'PREMIUM' && subtotal.value > 100_000) {
      return subtotal.applyPercentageDiscount(10);
    }

    return subtotal;
  }
}
