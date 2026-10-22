import { createLedger } from '../ledger/create-ledger.js';
import { OrderRepository } from '../orders/order-repository.js';
import { RefundService } from '../refunds/refund-service.js';
import { PaymentService } from '../payments/payment-service.js';

export class CheckoutApi {
  constructor(orders = new OrderRepository(), refunds = new RefundService(), payments = new PaymentService(), ledger = createLedger()) {
    this.orders = orders;
    this.refunds = refunds;
    this.payments = payments;
    this.ledger = ledger;
  }

  requestRefund(customerId, request) {
    const order = this.orders.get(request.orderId);
    if (order.customerId !== customerId) throw new Error('Order belongs to another customer');
    return this.refunds.issueRefund(request);
  }

  accountSummary(customerId) {
    const orders = this.orders.list().filter(order => order.customerId === customerId);
    const cardRefunds = orders.flatMap(order => this.payments.refundsForOrder(order));
    return { customerId, orders, cardRefunds, storeCredit: this.ledger.balance(customerId, 'EUR') };
  }
}
