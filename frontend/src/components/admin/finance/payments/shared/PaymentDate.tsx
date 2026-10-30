// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Date
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Format payment timestamps consistently.
// - Preserve the original timestamp in the semantic datetime attribute.
// - Handle missing and invalid dates safely.
// -----------------------------------------------------------------------------

import type { HTMLAttributes } from 'react';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type PaymentDateFormat = 'date' | 'datetime' | 'relative';

export interface PaymentDateProps
  extends Omit<HTMLAttributes<HTMLTimeElement>, 'children'> {
  value?: string | Date | null;
  format?: PaymentDateFormat;
  locale?: string;
  fallback?: string;
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatRelativeDate(value: Date, locale?: string): string {
  const difference = value.getTime() - Date.now();
  const seconds = Math.round(difference / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  const formatter = new Intl.RelativeTimeFormat(locale, {
    numeric: 'auto',
  });

  if (Math.abs(seconds) < 60) {
    return formatter.format(seconds, 'second');
  }

  if (Math.abs(minutes) < 60) {
    return formatter.format(minutes, 'minute');
  }

  if (Math.abs(hours) < 24) {
    return formatter.format(hours, 'hour');
  }

  return formatter.format(days, 'day');
}

function formatPaymentDate(
  value: Date,
  format: PaymentDateFormat,
  locale?: string,
): string {
  if (format === 'relative') {
    return formatRelativeDate(value, locale);
  }

  if (format === 'date') {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
    }).format(value);
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(value);
}

// -----------------------------------------------------------------------------
// PaymentDate
// -----------------------------------------------------------------------------

export function PaymentDate({
  value,
  format = 'datetime',
  locale,
  fallback = '—',
  className,
  ...props
}: PaymentDateProps) {
  if (value === null || value === undefined || value === '') {
    return <span className={className}>{fallback}</span>;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return <span className={className}>{fallback}</span>;
  }

  let formattedDate: string;

  try {
    formattedDate = formatPaymentDate(date, format, locale);
  } catch {
    formattedDate = date.toISOString();
  }

  return (
    <time
      {...props}
      dateTime={date.toISOString()}
      title={date.toISOString()}
      className={className}
    >
      {formattedDate}
    </time>
  );
}