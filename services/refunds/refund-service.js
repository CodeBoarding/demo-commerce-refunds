export class RefundService {
  #requests = new Map();

  constructor(orders, payments, policy, notifications) {
    Object.assign(this, { orders, payments, policy, notifications });
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
    const paymentRefund = this.payments.refundOriginalPayment(order, amount, requestId);
    const refund = { ...paymentRefund, orderId, customerId: order.customerId, status: 'completed' };
    this.orders.recordRefund(orderId, refund);
    this.notifications.sendRefundReceipt(refund);
    this.#requests.set(requestId, refund);
    return { ...refund };
  }
}
