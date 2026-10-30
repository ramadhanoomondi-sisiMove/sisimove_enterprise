// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Method Date
// -----------------------------------------------------------------------------
//
// Formats payment-method timestamps consistently for admin surfaces.
// -----------------------------------------------------------------------------

export interface PaymentMethodDateProps {
  date?: string | Date | null;
  includeTime?: boolean;
  className?: string;
}

export function PaymentMethodDate({
  date,
  includeTime = false,
  className,
}: PaymentMethodDateProps) {
  if (date == null || date === '') {
    return (
      <time
        className={[
          'text-sm text-[var(--foreground-muted)]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        —
      </time>
    );
  }

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return (
      <span
        className={[
          'text-sm text-[var(--foreground-muted)]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        Invalid date
      </span>
    );
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  return (
    <time
      dateTime={parsedDate.toISOString()}
      title={parsedDate.toISOString()}
      className={[
        'text-sm text-[var(--foreground-secondary)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {new Intl.DateTimeFormat('en-GB', dateOptions).format(parsedDate)}
    </time>
  );
}

export default PaymentMethodDate;