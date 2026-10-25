
import { cn } from '@/foundation/utils/cn';

export interface TransactionDateProps {
  value: string | Date | null | undefined;
  className?: string;
  locale?: string;
  includeTime?: boolean;
  fallback?: string;
}

export function TransactionDate({
  value,
  className,
  locale = 'en-KE',
  includeTime = true,
  fallback = '—',
}: TransactionDateProps) {
  if (value == null || value === '') {
    return <span className={className}>{fallback}</span>;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return <span className={className}>{fallback}</span>;
  }

  const formatted = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    ...(includeTime
      ? {
          hour: '2-digit',
          minute: '2-digit',
        }
      : {}),
  }).format(date);

  return (
    <time
      dateTime={date.toISOString()}
      title={date.toISOString()}
      className={cn(
        'whitespace-nowrap text-sm text-[var(--foreground-secondary)]',
        className,
      )}
    >
      {formatted}
    </time>
  );
}

export default TransactionDate;
