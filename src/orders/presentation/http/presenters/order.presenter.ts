import { Order } from '../../../domain/order';

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id,
      customerId: order.customerId,
      customerType: order.customerType,
      items: order.items.map((item) => ({
        productId: item.getProductId(),
        name: item.getName(),
        priceInCents: item.getPriceInCents(),
        quantity: item.getQuantity(),
        subtotalInCents: item.getSubtotal().value,
      })),
      totalInCents: order.totalInCents,
      status: order.status,
      paymentTransactionId: order.paymentTransactionId ?? null,
      createdAt: order.createdAt,
    };
  }
}
