import { formatMoney } from '../../packages/money/money.js';

export class NotificationService {
  #messages = [];

  sendRefundReceipt(refund) {
    this.#messages.push({
      customerId: refund.customerId,
      subject: 'Your refund is complete',
      body: `${formatMoney(refund.amount, refund.currency)} refunded to ${refund.destination}.`,
      refundId: refund.id,
    });
  }

  list() { return this.#messages.map(message => ({ ...message })); }
}
