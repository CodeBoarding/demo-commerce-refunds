import { assertAmount } from '../shared/money.js';

/** Local stand-in for the external card network. No network requests are made. */
export class CardGateway {
  #reversals = new Map();

  reverseCharge({ paymentId, amount, currency, requestId }) {
    assertAmount(amount, currency);
    const previous = this.#reversals.get(requestId);
    if (previous) {
      if (previous.paymentId !== paymentId || previous.amount !== amount || previous.currency !== currency) {
        throw new Error('Request ID reused with different payment');
      }
      return { ...previous };
    }
    const reversal = { id: `card-${requestId}`, paymentId, amount, currency, destination: 'original-card' };
    this.#reversals.set(requestId, reversal);
    return { ...reversal };
  }

  listReversals() { return [...this.#reversals.values()].map(value => ({ ...value })); }
}
