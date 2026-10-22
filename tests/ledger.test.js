import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createLedger } from '../ledger/create-ledger.js';

const order = { id: 'order-1042', customerId: 'customer-demo', paidAmount: 12900, currency: 'EUR' };

test('a posted refund is immediately available as store credit', () => {
  const ledger = createLedger();
  ledger.creditRefund(order, 4900, 'r-1');
  assert.equal(ledger.balance(order.customerId, 'EUR'), 4900);
});

test('reposting the same refund does not double the balance', () => {
  const ledger = createLedger();
  ledger.creditRefund(order, 4900, 'r-1');
  ledger.creditRefund(order, 4900, 'r-1');
  assert.equal(ledger.balance(order.customerId, 'EUR'), 4900);
  assert.equal(ledger.outbox.pending().length, 1);
});

test('settlements do not become spendable customer credit', () => {
  const ledger = createLedger();
  ledger.recordSettlement(order, 's-1');
  assert.equal(ledger.balance(order.customerId, 'EUR'), 0);
});

test('credit is isolated by customer and currency', () => {
  const ledger = createLedger();
  ledger.creditRefund(order, 4900, 'r-1');
  assert.equal(ledger.balance('another-customer', 'EUR'), 0);
  assert.equal(ledger.balance(order.customerId, 'CHF'), 0);
});

test('conflicting ledger entry IDs are rejected', () => {
  const ledger = createLedger();
  ledger.creditRefund(order, 4900, 'r-1');
  assert.throws(() => ledger.creditRefund(order, 5100, 'r-1'), /conflict/);
});
