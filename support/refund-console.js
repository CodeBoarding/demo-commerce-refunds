import { RefundService } from '../refunds/refund-service.js';

export class SupportConsole {
  constructor(refunds = new RefundService()) { this.refunds = refunds; }

  issueGoodwillRefund(orderId, amount, caseId) {
    return this.refunds.issueRefund({ orderId, amount, requestId: `support-${caseId}` });
  }
}
