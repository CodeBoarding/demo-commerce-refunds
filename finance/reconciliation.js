import { OrderRepository } from '../orders/order-repository.js';
import { PaymentService } from '../payments/payment-service.js';

export class FinanceExport {
  constructor(orders = new OrderRepository(), payments = new PaymentService()) {
    this.orders = orders;
    this.payments = payments;
  }

  reconcile() {
    return this.orders.list().map(order => {
      const cardAmount = this.payments.refundsForOrder(order).reduce((sum, refund) => sum + refund.amount, 0);
      return { orderId: order.id, recordedRefunds: order.refundedAmount, cardRefunds: cardAmount, discrepancy: order.refundedAmount - cardAmount };
    });
  }
}
