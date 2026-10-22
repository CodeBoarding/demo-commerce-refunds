export class OrderRepository {
  #orders = new Map();

  add(order) {
    if (this.#orders.has(order.id)) throw new Error('Order already exists');
    this.#orders.set(order.id, { ...order, refundedAmount: 0, refundIds: [] });
  }

  get(orderId) {
    const order = this.#orders.get(orderId);
    if (!order) throw new Error('Order not found');
    return structuredClone(order);
  }

  recordRefund(orderId, refund) {
    const order = this.#orders.get(orderId);
    if (!order) throw new Error('Order not found');
    if (order.refundIds.includes(refund.id)) return this.get(orderId);
    if (order.refundedAmount + refund.amount > order.paidAmount) throw new Error('Refund exceeds payment');
    order.refundedAmount += refund.amount;
    order.refundIds.push(refund.id);
    return this.get(orderId);
  }

  list() { return [...this.#orders.keys()].map(id => this.get(id)); }
}
