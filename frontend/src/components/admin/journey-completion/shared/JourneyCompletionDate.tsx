
import type { HTMLAttributes } from 'react';

import { cn } from '@/foundation/utils/cn';

export type JourneyCompletionDateFormat =
  | 'date'
  | 'datetime'
  | 'time';

export interface JourneyCompletionDateProps
  extends Omit<HTMLAttributes<HTMLTimeElement>, 'children'> {
  value?: string | Date | null;
  format?: JourneyCompletionDateFormat;
  fallback?: string;
  locale?: string;
}

const DATE_FORMATS: Record<
  JourneyCompletionDateFormat,
  Intl.DateTimeFormatOptions
> = {
  date: {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  },
  datetime: {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  },
  time: {
    hour: '2-digit',
    minute: '2-digit',
  },
};

export function JourneyCompletionDate({
  value,
  format = 'date',
  fallback = '—',
  locale = 'en-KE',
  className,
  ...props
}: JourneyCompletionDateProps) {
  if (!value) {
    return (
      <span
        className={cn(
          'text-sm text-[var(--foreground-muted)]',
          className,
        )}
      >
        {fallback}
      </span>
    );
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return (
      <span
        className={cn(
          'text-sm text-[var(--foreground-muted)]',
          className,
        )}
      >
        {fallback}
      </span>
    );
  }

  const formattedDate = new Intl.DateTimeFormat(
    locale,
    DATE_FORMATS[format],
  ).format(date);

  return (
    <time
      {...props}
      dateTime={date.toISOString()}
      className={cn(
        'text-sm',
        'text-[var(--foreground-secondary)]',
        className,
      )}
    >
      {formattedDate}
    </time>
  );
}
