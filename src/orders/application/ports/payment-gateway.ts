export interface PaymentInput {
  orderId: string;
  amountInCents: number;
  idempotencyKey: string;
}

export interface PaymentResult {
  transactionId: string;
}

export abstract class PaymentGateway {
  abstract charge(input: PaymentInput): Promise<PaymentResult>;
}
