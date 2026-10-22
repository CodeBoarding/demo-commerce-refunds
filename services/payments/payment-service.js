export class PaymentService {
  constructor(cardGateway, ledger) { Object.assign(this, { cardGateway, ledger }); }

  recordSettlement(order, requestId) {
    return this.ledger.recordSettlement(order, requestId);
  }

  refundOriginalPayment(order, amount, requestId) {
    return this.cardGateway.reverseCharge({ paymentId: order.paymentId, amount, currency: order.currency, requestId });
  }

  refundsForOrder(order) {
    return this.cardGateway.listReversals().filter(refund => refund.paymentId === order.paymentId);
  }
}
