import { OrderRepository } from './services/orders/order-repository.js';
import { CardGateway } from './services/payments/card-gateway.js';
import { PaymentService } from './services/payments/payment-service.js';
import { RefundPolicy } from './services/refunds/refund-policy.js';
import { RefundService } from './services/refunds/refund-service.js';
import { NotificationService } from './services/notifications/notification-service.js';
import { CheckoutApi } from './services/checkout/checkout-api.js';
import { StorefrontAccount } from './apps/storefront/account-page.js';
import { SupportConsole } from './apps/support/refund-console.js';
import { FinanceExport } from './apps/finance/reconciliation.js';

export function createCommerce() {
  const orders = new OrderRepository();
  const cardGateway = new CardGateway();
  const payments = new PaymentService(cardGateway);
  const notifications = new NotificationService();
  const refunds = new RefundService(orders, payments, new RefundPolicy(), notifications);
  const checkout = new CheckoutApi(orders, refunds, payments);
  const storefront = new StorefrontAccount(checkout);
  const support = new SupportConsole(refunds);
  const finance = new FinanceExport(orders, payments);
  return { orders, cardGateway, payments, notifications, refunds, checkout, storefront, support, finance };
}
