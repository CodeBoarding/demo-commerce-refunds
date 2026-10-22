export class CheckoutApi {
  constructor(orders, refunds, payments, ledger) { Object.assign(this, { orders, refunds, payments, ledger }); }

  requestRefund(customerId, request) {
    const order = this.orders.get(request.orderId);
    if (order.customerId !== customerId) throw new Error('Order belongs to another customer');
    return this.refunds.issueRefund(request);
  }

  accountSummary(customerId) {
    const orders = this.orders.list().filter(order => order.customerId === customerId);
    const cardRefunds = orders.flatMap(order => this.payments.refundsForOrder(order));
    return { customerId, orders, cardRefunds, storeCredit: this.ledger.balance(customerId, 'EUR') };
  }
}
