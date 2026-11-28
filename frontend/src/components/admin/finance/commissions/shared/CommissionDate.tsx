
// src/components/admin/commissions/shared/CommissionDate.tsx

import {
  formatDate,
} from '@/foundation';

export interface CommissionDateProps {
  readonly value?: string | Date | null;
  readonly className?: string;
}

export function CommissionDate({
  value,
  className,
}: CommissionDateProps) {
  if (!value) {
    return (
      <span
        className={[
          'text-[var(--muted-foreground)]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        —
      </span>
    );
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return (
      <span
        className={[
          'text-[var(--muted-foreground)]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        —
      </span>
    );
  }

  return (
    <time
      dateTime={date.toISOString()}
      className={[
        'inline-flex',
        'tabular-nums',
        'text-[var(--foreground)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {formatDate(date)}
    </time>
  );
}
