import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCommerce } from '../app.js';

function fixture() {
  const app = createCommerce();
  app.orders.add({ id: 'order-1042', customerId: 'customer-demo', paymentId: 'payment-1042', paidAmount: 12900, currency: 'EUR', status: 'paid' });
  return app;
}

test('an instant refund updates the account balance', () => {
  const app = fixture();
  const result = app.storefront.refundOrder('customer-demo', 'order-1042', 4900, 'refund-demo');
  assert.equal(result.status, 'completed');
  assert.equal(app.ledger.balance('customer-demo', 'EUR'), 4900);
});

test('a retry does not refund the card twice', () => {
  const app = fixture();
  app.storefront.refundOrder('customer-demo', 'order-1042', 4900, 'refund-demo');
  app.storefront.refundOrder('customer-demo', 'order-1042', 4900, 'refund-demo');
  assert.equal(app.orders.get('order-1042').refundedAmount, 4900);
  assert.equal(app.notifications.list().length, 1);
});

test('a refund cannot exceed the remaining paid amount', () => {
  const app = fixture();
  assert.throws(() => app.storefront.refundOrder('customer-demo', 'order-1042', 15000, 'too-much'), /exceeds/);
  assert.equal(app.orders.get('order-1042').refundedAmount, 0);
});

test('checkout rejects another customer', () => {
  const app = fixture();
  assert.throws(() => app.storefront.refundOrder('someone-else', 'order-1042', 4900, 'wrong-customer'), /another customer/);
});

test('support uses the same refund operation', () => {
  const app = fixture();
  app.support.issueGoodwillRefund('order-1042', 2500, 'case-12');
  assert.equal(app.orders.get('order-1042').refundedAmount, 2500);
});

test('a request ID cannot be reused with a different amount', () => {
  const app = fixture();
  app.storefront.refundOrder('customer-demo', 'order-1042', 4900, 'refund-demo');
  assert.throws(() => app.storefront.refundOrder('customer-demo', 'order-1042', 1000, 'refund-demo'), /conflict/);
});
