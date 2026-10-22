import { LedgerEntryRepository } from './entry-repository.js';

export class LedgerBalanceReader {
  constructor(entries = new LedgerEntryRepository()) { this.entries = entries; }

  availableCredit(accountId) {
    return this.entries.forAccount(accountId)
      .filter(entry => entry.kind === 'refund-credit')
      .reduce((total, entry) => total + entry.amount, 0);
  }
}
