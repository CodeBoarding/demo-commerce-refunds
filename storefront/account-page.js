import { createLedger } from '../ledger/create-ledger.js';
import { CheckoutApi } from '../checkout/checkout-api.js';
import { formatMoney } from '../shared/money.js';

/** Account view model consumed by the storefront UI. */
export class StorefrontAccount {
  constructor(checkout = new CheckoutApi(), ledger = createLedger()) {
    this.checkout = checkout;
    this.ledger = ledger;
  }

  refundOrder(customerId, orderId, amount, requestId) {
    return this.checkout.requestRefund(customerId, { orderId, amount, requestId });
  }

  renderBalance(customerId, currency = 'EUR') {
    const availableCredit = this.ledger.balance(customerId, currency);
    return `Store credit: ${formatMoney(availableCredit, currency)}`;
  }
}
