export class LedgerBalanceReader {
  constructor(entries) { this.entries = entries; }

  availableCredit(accountId) {
    return this.entries.forAccount(accountId)
      .filter(entry => entry.kind === 'refund-credit')
      .reduce((total, entry) => total + entry.amount, 0);
  }
}
