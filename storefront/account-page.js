import { CheckoutApi } from '../checkout/checkout-api.js';
import { formatMoney } from '../shared/money.js';

/** Account view model consumed by the storefront UI. */
export class StorefrontAccount {
  constructor(checkout = new CheckoutApi()) { this.checkout = checkout; }

  refundOrder(customerId, orderId, amount, requestId) {
    return this.checkout.requestRefund(customerId, { orderId, amount, requestId });
  }

  renderBalance(customerId, currency = 'EUR') {
    const summary = this.checkout.accountSummary(customerId);
    return `Store credit: ${formatMoney(summary.storeCredit, currency)}`;
  }
}
