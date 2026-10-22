import { OrderRepository } from '../orders/order-repository.js';
import { createLedger } from '../ledger/create-ledger.js';
import { RefundPolicy } from './refund-policy.js';
import { NotificationService } from '../notifications/notification-service.js';

export class RefundService {
  #requests = new Map();

  constructor(orders = new OrderRepository(), ledger = createLedger(), policy = new RefundPolicy(), notifications = new NotificationService()) {
    this.orders = orders;
    this.ledger = ledger;
    this.policy = policy;
    this.notifications = notifications;
  }

  issueRefund({ orderId, amount, requestId }) {
    if (!requestId) throw new Error('Request ID required');
    const previous = this.#requests.get(requestId);
    if (previous) {
      if (previous.orderId !== orderId || previous.amount !== amount) throw new Error('Request ID conflict');
      return { ...previous };
    }
    const order = this.orders.get(orderId);
    this.policy.validate(order, amount);
    const ledgerEntry = this.ledger.creditRefund(order, amount, requestId);
    const refund = { ...ledgerEntry, orderId, customerId: order.customerId, status: 'completed' };
    this.orders.recordRefund(orderId, refund);
    this.notifications.sendRefundReceipt(refund);
    this.#requests.set(requestId, refund);
    return { ...refund };
  }
}
