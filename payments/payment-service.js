import { createLedger } from '../ledger/create-ledger.js';
import { CardGateway } from './card-gateway.js';

export class PaymentService {
  constructor(cardGateway = new CardGateway(), ledger = createLedger()) {
    this.cardGateway = cardGateway;
    this.ledger = ledger;
  }

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
