// src/components/admin/commissions/shared/CommissionPercentage.tsx

// -----------------------------------------------------------------------------
// sisiMove Admin — Commission Percentage
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display a commission percentage consistently.
// - Preserve the supplied decimal representation.
// - Avoid recalculating commission values.
// - Support optional label and compact presentation.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface CommissionPercentageProps {
  readonly value: string | number;
  readonly label?: string;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function CommissionPercentage({
  value,
  label,
  className,
}: CommissionPercentageProps) {
  const normalizedValue = String(value).trim();

  const displayValue = normalizedValue
    ? `${normalizedValue}%`
    : '—';

  return (
    <span
      className={[
        'inline-flex',
        'items-baseline',
        'gap-1',
        'text-sm',
        'font-medium',
        'tabular-nums',
        'text-[var(--foreground)]',
        className,
      ].filter(Boolean).join(' ')}
    >
      {label && (
        <span className="text-[var(--foreground-muted)]">
          {label}
        </span>
      )}

      <span>{displayValue}</span>
    </span>
  );
}