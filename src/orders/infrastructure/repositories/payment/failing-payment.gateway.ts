import { Injectable } from '@nestjs/common';
import {
  PaymentGateway,
  PaymentInput,
  PaymentResult,
} from 'src/orders/application/ports';

@Injectable()
export class FailingPaymentGateway implements PaymentGateway {
  async charge(input: PaymentInput): Promise<PaymentResult> {
    throw new Error(`Payment provider unavailable for order ${input.orderId}`);
  }
}
