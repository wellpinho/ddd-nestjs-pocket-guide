import { Injectable } from '@nestjs/common';
import {
  PaymentGateway,
  PaymentInput,
  PaymentResult,
} from 'src/orders/application/ports/payment-gateway';

@Injectable()
export class FakePaymentGateway implements PaymentGateway {
  async charge(input: PaymentInput): Promise<PaymentResult> {
    return await new Promise((resolve) => {
      resolve({
        transactionId: `fake-${input.orderId}`,
      });
    });
  }
}
