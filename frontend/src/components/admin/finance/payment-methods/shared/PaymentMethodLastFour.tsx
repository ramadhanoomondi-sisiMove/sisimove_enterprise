// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Method Last Four
// -----------------------------------------------------------------------------
//
// Displays only the masked identifier supplied by the API.
// This component never attempts to retrieve or construct payment credentials.
// -----------------------------------------------------------------------------

export interface PaymentMethodLastFourProps {
  lastFour?: string | null;
  className?: string;
}

export function PaymentMethodLastFour({
  lastFour,
  className,
}: PaymentMethodLastFourProps) {
  const value = lastFour?.trim();

  return (
    <span
      className={[
        'inline-flex items-center gap-2',
        'font-mono text-sm',
        'text-[var(--foreground-secondary)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={
        value
          ? `Payment method ending in ${value}`
          : 'Payment method identifier unavailable'
      }
    >
      {value ? (
        <>
          <span aria-hidden="true" className="tracking-widest">
            ••••
          </span>
          <span>{value}</span>
        </>
      ) : (
        <span className="font-sans text-[var(--foreground-muted)]">
          Not available
        </span>
      )}
    </span>
  );
}

export default PaymentMethodLastFour;