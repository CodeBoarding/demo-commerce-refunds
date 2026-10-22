export class LedgerEntryRepository {
  #entries = new Map();

  insert(entry) {
    const existing = this.#entries.get(entry.id);
    if (existing && JSON.stringify(existing) !== JSON.stringify(entry)) throw new Error('Entry ID conflict');
    this.#entries.set(entry.id, { ...entry });
    return { ...entry };
  }

  forAccount(accountId) {
    return [...this.#entries.values()].filter(entry => entry.accountId === accountId).map(entry => ({ ...entry }));
  }
}
