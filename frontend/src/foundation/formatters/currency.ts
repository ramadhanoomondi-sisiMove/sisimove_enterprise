export function formatCurrency(
  amount: number,
  currency = 'KES',
): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyMinorUnits(
  amount: number,
  currency = 'KES',
): string {
  const formatter = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
  });

  const fractionDigits =
    formatter.resolvedOptions().maximumFractionDigits ?? 0;

  const majorUnitAmount =
    amount / 10 ** fractionDigits;

  return formatter.format(majorUnitAmount);
}