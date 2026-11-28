
// src/components/admin/commissions/shared/CommissionCurrency.tsx

export interface CommissionCurrencyProps {
  readonly currency: string;
  readonly className?: string;
}

export function CommissionCurrency({
  currency,
  className,
}: CommissionCurrencyProps) {
  const normalizedCurrency = currency.trim().toUpperCase();

  return (
    <span
      className={[
        'inline-flex',
        'font-medium',
        'text-[var(--muted-foreground)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {normalizedCurrency || '—'}
    </span>
  );
}
