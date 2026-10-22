export class FinanceExport {
  constructor(orders, payments) { Object.assign(this, { orders, payments }); }

  reconcile() {
    return this.orders.list().map(order => {
      const cardAmount = this.payments.refundsForOrder(order).reduce((sum, refund) => sum + refund.amount, 0);
      return { orderId: order.id, recordedRefunds: order.refundedAmount, cardRefunds: cardAmount, discrepancy: order.refundedAmount - cardAmount };
    });
  }
}
