
import {
  formatDate,
  formatDateTime,
} from '@/foundation/formatters/date';

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface WithdrawalDateProps {
  value?: string | Date | null;
  includeTime?: boolean;
  emptyLabel?: string;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function WithdrawalDate({
  value,
  includeTime = false,
  emptyLabel = '—',
  className,
}: WithdrawalDateProps) {
  if (!value) {
    return <span className={className}>{emptyLabel}</span>;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return <span className={className}>{emptyLabel}</span>;
  }

  const formattedDate = includeTime
    ? formatDateTime(date)
    : formatDate(date);

  return (
    <time
      dateTime={date.toISOString()}
      title={formatDateTime(date)}
      className={cn(
        'text-sm',
        'tabular-nums',
        'text-[var(--foreground-secondary)]',
        className,
      )}
    >
      {formattedDate}
    </time>
  );
}

export default WithdrawalDate;
