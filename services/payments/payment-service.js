export class PaymentService {
  constructor(cardGateway) { this.cardGateway = cardGateway; }

  refundOriginalPayment(order, amount, requestId) {
    return this.cardGateway.reverseCharge({ paymentId: order.paymentId, amount, currency: order.currency, requestId });
  }

  refundsForOrder(order) {
    return this.cardGateway.listReversals().filter(refund => refund.paymentId === order.paymentId);
  }
}
