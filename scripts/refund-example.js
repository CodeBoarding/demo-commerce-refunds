import { createCommerce } from '../app.js';

const app = createCommerce();
app.orders.add({ id: 'order-1042', customerId: 'customer-demo', paymentId: 'payment-1042', paidAmount: 12900, currency: 'EUR', status: 'paid' });
const refund = app.storefront.refundOrder('customer-demo', 'order-1042', 4900, 'refund-demo');
console.log(JSON.stringify({ refund, cardReversals: app.cardGateway.listReversals(), account: app.storefront.renderBalance('customer-demo'), finance: app.finance.reconcile() }, null, 2));
