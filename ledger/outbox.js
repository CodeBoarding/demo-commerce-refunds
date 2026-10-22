export class LedgerOutbox {
  #events = new Map();

  enqueue(entry) {
    const event = { id: `event-${entry.id}`, kind: 'ledger.entry.posted', entryId: entry.id, accountId: entry.accountId };
    this.#events.set(event.id, event);
    return { ...event };
  }

  pending() { return [...this.#events.values()].map(event => ({ ...event })); }
}
