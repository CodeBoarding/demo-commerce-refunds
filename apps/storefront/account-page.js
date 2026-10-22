import { formatMoney } from '../../packages/money/money.js';

/** Account view model consumed by the storefront UI. */
export class StorefrontAccount {
  constructor(checkout) { this.checkout = checkout; }

  refundOrder(customerId, orderId, amount, requestId) {
    return this.checkout.requestRefund(customerId, { orderId, amount, requestId });
  }

  renderBalance(customerId, currency = 'EUR') {
    const summary = this.checkout.accountSummary(customerId);
    return `Store credit: ${formatMoney(summary.storeCredit, currency)}`;
  }
}
