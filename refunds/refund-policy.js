import { assertAmount } from '../shared/money.js';

export class RefundPolicy {
  validate(order, amount) {
    assertAmount(amount, order.currency);
    if (order.status !== 'paid') throw new Error('Only paid orders can be refunded');
    if (amount > order.paidAmount - order.refundedAmount) throw new Error('Refund exceeds remaining payment');
  }
}
