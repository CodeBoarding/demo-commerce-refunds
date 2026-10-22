import { createLedger } from './ledger/create-ledger.js';
import { OrderRepository } from './orders/order-repository.js';
import { CardGateway } from './payments/card-gateway.js';
import { PaymentService } from './payments/payment-service.js';
import { RefundPolicy } from './refunds/refund-policy.js';
import { RefundService } from './refunds/refund-service.js';
import { NotificationService } from './notifications/notification-service.js';
import { CheckoutApi } from './checkout/checkout-api.js';
import { StorefrontAccount } from './storefront/account-page.js';
import { SupportConsole } from './support/refund-console.js';
import { FinanceExport } from './finance/reconciliation.js';

export function createCommerce() {
  const orders = new OrderRepository();
  const cardGateway = new CardGateway();
  const ledger = createLedger();
  const payments = new PaymentService(cardGateway, ledger);
  const notifications = new NotificationService();
  const refunds = new RefundService(orders, ledger, new RefundPolicy(), notifications);
  const checkout = new CheckoutApi(orders, refunds, payments, ledger);
  const storefront = new StorefrontAccount(checkout, ledger);
  const support = new SupportConsole(refunds);
  const finance = new FinanceExport(orders, payments);
  return { orders, cardGateway, payments, notifications, refunds, checkout, storefront, support, finance, ledger };
}
