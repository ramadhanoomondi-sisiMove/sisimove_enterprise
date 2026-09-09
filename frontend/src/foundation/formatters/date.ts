// -----------------------------------------------------------------------------
// Date Formatter
// -----------------------------------------------------------------------------

export function formatDate(
  value: string | Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  return new Intl.DateTimeFormat(
    'en-KE',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      ...options,
    },
  ).format(date);
}

// -----------------------------------------------------------------------------
// Time Formatter
// -----------------------------------------------------------------------------

export function formatTime(
  value: string | Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  return new Intl.DateTimeFormat(
    'en-KE',
    {
      hour: 'numeric',
      minute: '2-digit',
      ...options,
    },
  ).format(date);
}

// -----------------------------------------------------------------------------
// Date & Time Formatter
// -----------------------------------------------------------------------------

export function formatDateTime(
  value: string | Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  return new Intl.DateTimeFormat(
    'en-KE',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      ...options,
    },
  ).format(date);
}