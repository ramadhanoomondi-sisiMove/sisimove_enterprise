// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Account Formatters
// -----------------------------------------------------------------------------
// Pure formatting helpers. API/domain values remain unchanged; these functions
// only prepare values for display in the admin UI.
// -----------------------------------------------------------------------------

const EMPTY_VALUE = '—';

/** Format an integer amount expressed in the currency's minor units. */
export function formatFinancialAmount(
  amountMinor: number | null | undefined,
  currency: string | null | undefined,
  locale = 'en-KE',
): string {
  if (
    typeof amountMinor !== 'number' ||
    !Number.isFinite(amountMinor) ||
    !Number.isInteger(amountMinor) ||
    !currency?.trim()
  ) {
    return EMPTY_VALUE;
  }

  const normalizedCurrency = currency.trim().toUpperCase();

  try {
    const currencyFormatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: normalizedCurrency,
    });

    const fractionDigits =
      currencyFormatter.resolvedOptions().maximumFractionDigits ?? 2;

    const majorAmount = amountMinor / 10 ** fractionDigits;

    return currencyFormatter.format(majorAmount);
  } catch {
    // An unknown currency code should not crash a dashboard render.
    return `${normalizedCurrency} ${amountMinor}`;
  }
}

/** Format an ISO date/date-time string for concise admin-table display. */
export function formatFinancialDate(
  value: string | Date | null | undefined,
  locale = 'en-KE',
): string {
  if (value == null || value === '') {
    return EMPTY_VALUE;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return EMPTY_VALUE;
  }

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/** Format an ISO date-time string with time for audit/detail views. */
export function formatFinancialDateTime(
  value: string | Date | null | undefined,
  locale = 'en-KE',
): string {
  if (value == null || value === '') {
    return EMPTY_VALUE;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return EMPTY_VALUE;
  }

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/** Render absent optional identifiers consistently without altering real IDs. */
export function formatFinancialIdentifier(
  value: string | null | undefined,
): string {
  const trimmed = value?.trim();

  return trimmed ? trimmed : EMPTY_VALUE;
}

/** Format an integer count for dashboard metrics. */
export function formatFinancialCount(
  value: number | null | undefined,
  locale = 'en-KE',
): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return EMPTY_VALUE;
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(value);
}
