import { assertAmount } from '../../packages/money/money.js';

/** Posts commerce money events and exposes customers' available store credit. */
export class LedgerService {
  constructor(accounts, entries, balances, outbox) { Object.assign(this, { accounts, entries, balances, outbox }); }

  creditRefund(order, amount, requestId) {
    assertAmount(amount, order.currency);
    const account = this.accounts.forCustomer(order.customerId, order.currency);
    const entry = this.entries.insert({
      id: `ledger-${requestId}`, accountId: account.id, amount, currency: order.currency,
      kind: 'refund-credit', orderId: order.id, destination: 'store-credit',
    });
    this.outbox.enqueue(entry);
    return entry;
  }

  recordSettlement(order, requestId) {
    assertAmount(order.paidAmount, order.currency);
    const account = this.accounts.forCustomer(order.customerId, order.currency);
    const entry = this.entries.insert({
      id: `settlement-${requestId}`, accountId: account.id, amount: order.paidAmount,
      currency: order.currency, kind: 'card-settlement', orderId: order.id,
    });
    this.outbox.enqueue(entry);
    return entry;
  }

  balance(customerId, currency) {
    const account = this.accounts.forCustomer(customerId, currency);
    return this.balances.availableCredit(account.id);
  }
}
