import { formatMoney } from '../../packages/money/money.js';

/** Account view model consumed by the storefront UI. */
export class StorefrontAccount {
  constructor(checkout, ledger) { Object.assign(this, { checkout, ledger }); }

  refundOrder(customerId, orderId, amount, requestId) {
    return this.checkout.requestRefund(customerId, { orderId, amount, requestId });
  }

  renderBalance(customerId, currency = 'EUR') {
    const availableCredit = this.ledger.balance(customerId, currency);
    return `Store credit: ${formatMoney(availableCredit, currency)}`;
  }
}
