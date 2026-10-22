export class LedgerAccountRepository {
  #accounts = new Map();

  forCustomer(customerId, currency) {
    if (!customerId) throw new Error('Customer ID required');
    const key = `${customerId}:${currency}`;
    if (!this.#accounts.has(key)) this.#accounts.set(key, { id: key, customerId, currency });
    return { ...this.#accounts.get(key) };
  }
}
