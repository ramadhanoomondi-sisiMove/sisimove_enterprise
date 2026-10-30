// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Method Display Name
// -----------------------------------------------------------------------------
//
// Presents the safe, human-readable payment-method label.
// -----------------------------------------------------------------------------

export interface PaymentMethodDisplayNameProps {
  displayName?: string | null;
  className?: string;
}

export function PaymentMethodDisplayName({
  displayName,
  className,
}: PaymentMethodDisplayNameProps) {
  const value = displayName?.trim();

  return (
    <span
      className={[
        'block min-w-0 truncate',
        'text-sm font-medium text-[var(--foreground)]',
        !value && 'font-normal text-[var(--foreground-muted)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      title={value || undefined}
    >
      {value || 'Unnamed payment method'}
    </span>
  );
}

export default PaymentMethodDisplayName;