/**
 * Formats monetary amounts for Account Hold presentation.
 *
 * The amount must be supplied in the monetary unit expected by the
 * Financial domain. This formatter does not convert minor units to major units.
 */
export function formatAdminAccountHoldAmount(
  amount: number,
  currency: string,
  locale = 'en-KE',
): string {
  if (!Number.isFinite(amount)) {
    return '—';
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      currencyDisplay: 'symbol',
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString(locale)}`;
  }
}

/**
 * Formats a date/time for display.
 */
export function formatAdminAccountHoldDateTime(
  value?: string | Date | null,
  locale = 'en-KE',
): string {
  if (value == null || value === '') {
    return '—';
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

/**
 * Formats a date without the time component.
 */
export function formatAdminAccountHoldDate(
  value?: string | Date | null,
  locale = 'en-KE',
): string {
  if (value == null || value === '') {
    return '—';
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  }).format(date);
}

/**
 * Formats an optional public identifier for presentation.
 * The original identifier remains unchanged in the model.
 */
export function formatAdminAccountHoldReference(
  value?: string | null,
): string {
  return value?.trim() || '—';
}