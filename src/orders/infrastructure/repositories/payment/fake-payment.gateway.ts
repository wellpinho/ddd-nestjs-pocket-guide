import { Injectable } from '@nestjs/common';

import {
  PaymentGateway,
  PaymentInput,
  PaymentResult,
} from './../../../application/ports';

@Injectable()
export class FakePaymentGateway implements PaymentGateway {
  private readonly transactions = new Map<string, PaymentResult>();

  async charge(input: PaymentInput): Promise<PaymentResult> {
    const existing = this.transactions.get(input.idempotencyKey);

    if (existing) {
      return existing;
    }

    const result: PaymentResult = {
      transactionId: `fake-${input.orderId}`,
    };

    this.transactions.set(input.idempotencyKey, result);

    return result;
  }
}
