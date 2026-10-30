// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Method Public ID
// -----------------------------------------------------------------------------
//
// Presents the public API identifier consistently.
// -----------------------------------------------------------------------------

export interface PaymentMethodPublicIdProps {
  publicId: string;
  className?: string;
}

export function PaymentMethodPublicId({
  publicId,
  className,
}: PaymentMethodPublicIdProps) {
  const value = publicId.trim();

  return (
    <code
      title={value || undefined}
      className={[
        'inline-block max-w-full truncate',
        'rounded-[var(--radius-sm)]',
        'bg-[var(--background-subtle)]',
        'px-2 py-1',
        'font-mono text-xs',
        'text-[var(--foreground-secondary)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {value || '—'}
    </code>
  );
}

export default PaymentMethodPublicId;