import {
  PaymentGateway,
  PaymentInput,
  PaymentResult,
} from '../../application/ports/payment-gateway';

export class FailingPaymentGateway implements PaymentGateway {
  async charge(input: PaymentInput): Promise<PaymentResult> {
    throw new Error(`Payment provider unavailable for order ${input.orderId}`);
  }
}
