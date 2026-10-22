export class SupportConsole {
  constructor(refunds) { this.refunds = refunds; }

  issueGoodwillRefund(orderId, amount, caseId) {
    return this.refunds.issueRefund({ orderId, amount, requestId: `support-${caseId}` });
  }
}
