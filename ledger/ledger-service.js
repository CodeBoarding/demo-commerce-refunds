import { LedgerAccountRepository } from './account-repository.js';
import { LedgerEntryRepository } from './entry-repository.js';
import { LedgerBalanceReader } from './balance-reader.js';
import { LedgerOutbox } from './outbox.js';
import { assertAmount } from '../shared/money.js';

/** Posts commerce money events and exposes customers' available store credit. */
export class LedgerService {
  constructor(accounts = new LedgerAccountRepository(), entries = new LedgerEntryRepository(), balances = new LedgerBalanceReader(entries), outbox = new LedgerOutbox()) {
    this.accounts = accounts;
    this.entries = entries;
    this.balances = balances;
    this.outbox = outbox;
  }

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
