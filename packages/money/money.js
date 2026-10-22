export function assertAmount(amount, currency = 'EUR') {
  if (!Number.isSafeInteger(amount) || amount <= 0) throw new Error('Amount must be positive integer cents');
  if (!['EUR', 'USD', 'CHF'].includes(currency)) throw new Error('Unsupported currency');
  return { amount, currency };
}

export function formatMoney(amount, currency) {
  return new Intl.NumberFormat('en', { style: 'currency', currency }).format(amount / 100);
}
