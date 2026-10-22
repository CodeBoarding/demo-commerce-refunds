# Fernbank Commerce

An executable, synthetic commerce system for demonstrating architecture review with CodeBoarding. All customers, orders and payments are fictional. No payment network or external account is contacted.

## Run

Requires Node.js 22 or newer. No package installation is needed.

```
npm test
npm run demo
```

## Architecture

The Storefront uses the Checkout API. Checkout starts a refund through Refunds. Refunds validates the order, reverses the original payment through Payments, updates the order and sends a notification. Support uses the same refund operation. Finance reconciles orders against payment refunds.

Each service has a separate directory and a narrow interface. In-memory repositories make the full flow executable without a database or credentials.

## Product contract

- A refund returns money to the original payment method.
- The Storefront accesses money operations through Checkout.
- Repeating a refund with the same request ID must not move money twice.
- Refunds cannot exceed the amount paid or use another currency.

This repository is demonstration material, not a production payment implementation. The `feat/instant-refunds` pull request deliberately introduces regressions for a reviewer to discover. Its test suite represents the submitted change, not proof that all product requirements remain satisfied.
