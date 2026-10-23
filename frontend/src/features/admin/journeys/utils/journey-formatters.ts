
/**
 * Path:
 * src/features/journeys/utils/journey-formatters.ts
 *
 * sisiMove — Journey Control Center
 * Shared display formatters.
 *
 * Responsibilities:
 * - Format journey dates and times safely.
 * - Format currency and numeric values.
 * - Format route coordinates.
 * - Present public identifiers consistently.
 * - Normalize empty or missing values for display.
 *
 * Architectural rules:
 * - Pure utility functions only.
 * - No React, API, domain, or UI component dependencies.
 * - Never throw because an optional display value is missing or invalid.
 * - Preserve the original data; formatting is display-only.
 */

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type JourneyDateValue = Date | string | number | null | undefined;

export interface JourneyCoordinates {
  latitude: number;
  longitude: number;
}

export interface JourneyCoordinateValue {
  latitude?: number | null;
  longitude?: number | null;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const DEFAULT_LOCALE = 'en-KE';
const DEFAULT_TIME_ZONE = 'Africa/Nairobi';
const DEFAULT_CURRENCY = 'KES';
const DEFAULT_EMPTY_VALUE = '—';

// -----------------------------------------------------------------------------
// Internal Helpers
// -----------------------------------------------------------------------------

/**
 * Converts supported date values into a valid Date.
 *
 * Returns null when the input is absent or invalid.
 */
function toValidDate(value: JourneyDateValue): Date | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Returns whether a number is finite and safe to display.
 */
function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

// -----------------------------------------------------------------------------
// Date and Time Formatters
// -----------------------------------------------------------------------------

/**
 * Formats a date without a time component.
 *
 * Example:
 * formatDate('2026-10-22T08:30:00Z')
 */
export function formatDate(
  value: JourneyDateValue,
  options?: {
    locale?: string;
    timeZone?: string;
    emptyValue?: string;
  },
): string {
  const date = toValidDate(value);

  if (!date) {
    return options?.emptyValue ?? DEFAULT_EMPTY_VALUE;
  }

  try {
    return new Intl.DateTimeFormat(options?.locale ?? DEFAULT_LOCALE, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: options?.timeZone ?? DEFAULT_TIME_ZONE,
    }).format(date);
  } catch {
    return options?.emptyValue ?? DEFAULT_EMPTY_VALUE;
  }
}

/**
 * Formats a date and time for operational records.
 *
 * The default timezone is Nairobi time. Pass a different timezone when the
 * journey's schedule specifies another timezone.
 */
export function formatDateTime(
  value: JourneyDateValue,
  options?: {
    locale?: string;
    timeZone?: string;
    emptyValue?: string;
    hour12?: boolean;
  },
): string {
  const date = toValidDate(value);

  if (!date) {
    return options?.emptyValue ?? DEFAULT_EMPTY_VALUE;
  }

  try {
    return new Intl.DateTimeFormat(options?.locale ?? DEFAULT_LOCALE, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: options?.hour12 ?? false,
      timeZone: options?.timeZone ?? DEFAULT_TIME_ZONE,
    }).format(date);
  } catch {
    return options?.emptyValue ?? DEFAULT_EMPTY_VALUE;
  }
}

/**
 * Formats a time without a date component.
 */
export function formatTime(
  value: JourneyDateValue,
  options?: {
    locale?: string;
    timeZone?: string;
    emptyValue?: string;
    hour12?: boolean;
  },
): string {
  const date = toValidDate(value);

  if (!date) {
    return options?.emptyValue ?? DEFAULT_EMPTY_VALUE;
  }

  try {
    return new Intl.DateTimeFormat(options?.locale ?? DEFAULT_LOCALE, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: options?.hour12 ?? false,
      timeZone: options?.timeZone ?? DEFAULT_TIME_ZONE,
    }).format(date);
  } catch {
    return options?.emptyValue ?? DEFAULT_EMPTY_VALUE;
  }
}

/**
 * Formats a date as a compact label for tables and timelines.
 */
export function formatShortDate(
  value: JourneyDateValue,
  options?: {
    locale?: string;
    timeZone?: string;
    emptyValue?: string;
  },
): string {
  const date = toValidDate(value);

  if (!date) {
    return options?.emptyValue ?? DEFAULT_EMPTY_VALUE;
  }

  try {
    return new Intl.DateTimeFormat(options?.locale ?? DEFAULT_LOCALE, {
      day: '2-digit',
      month: 'short',
      timeZone: options?.timeZone ?? DEFAULT_TIME_ZONE,
    }).format(date);
  } catch {
    return options?.emptyValue ?? DEFAULT_EMPTY_VALUE;
  }
}

/**
 * Returns an ISO timestamp for machine-readable form values.
 *
 * Returns an empty string when the date is invalid or absent.
 */
export function toISOString(value: JourneyDateValue): string {
  const date = toValidDate(value);

  return date?.toISOString() ?? '';
}

// -----------------------------------------------------------------------------
// Currency and Number Formatters
// -----------------------------------------------------------------------------

/**
 * Formats a monetary amount using the supplied currency code.
 *
 * Amounts are assumed to already be expressed in major currency units.
 * This function does not convert currencies or infer minor-unit amounts.
 */
export function formatCurrency(
  amount: number | null | undefined,
  currency: string = DEFAULT_CURRENCY,
  options?: {
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    emptyValue?: string;
  },
): string {
  if (!isFiniteNumber(amount)) {
    return options?.emptyValue ?? DEFAULT_EMPTY_VALUE;
  }

  const normalizedCurrency = currency.trim().toUpperCase();

  if (!normalizedCurrency) {
    return formatNumber(amount, {
      locale: options?.locale,
      minimumFractionDigits: options?.minimumFractionDigits ?? 2,
      maximumFractionDigits: options?.maximumFractionDigits ?? 2,
      emptyValue: options?.emptyValue,
    });
  }

  try {
    return new Intl.NumberFormat(options?.locale ?? DEFAULT_LOCALE, {
      style: 'currency',
      currency: normalizedCurrency,
      minimumFractionDigits: options?.minimumFractionDigits,
      maximumFractionDigits: options?.maximumFractionDigits,
    }).format(amount);
  } catch {
    // Keep the amount visible if an unexpected currency code is received.
    return `${normalizedCurrency} ${formatNumber(amount, {
      locale: options?.locale,
      minimumFractionDigits: options?.minimumFractionDigits ?? 2,
      maximumFractionDigits: options?.maximumFractionDigits ?? 2,
    })}`;
  }
}

/**
 * Formats a number with locale-aware grouping and decimal separators.
 */
export function formatNumber(
  value: number | null | undefined,
  options?: {
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    emptyValue?: string;
  },
): string {
  if (!isFiniteNumber(value)) {
    return options?.emptyValue ?? DEFAULT_EMPTY_VALUE;
  }

  try {
    return new Intl.NumberFormat(options?.locale ?? DEFAULT_LOCALE, {
      minimumFractionDigits: options?.minimumFractionDigits,
      maximumFractionDigits: options?.maximumFractionDigits,
    }).format(value);
  } catch {
    return String(value);
  }
}

/**
 * Formats a percentage from a percentage value, not a decimal ratio.
 *
 * Example: formatPercentage(75) => "75%"
 */
export function formatPercentage(
  value: number | null | undefined,
  options?: {
    locale?: string;
    maximumFractionDigits?: number;
    emptyValue?: string;
  },
): string {
  if (!isFiniteNumber(value)) {
    return options?.emptyValue ?? DEFAULT_EMPTY_VALUE;
  }

  try {
    return `${new Intl.NumberFormat(options?.locale ?? DEFAULT_LOCALE, {
      maximumFractionDigits: options?.maximumFractionDigits ?? 1,
    }).format(value)}%`;
  } catch {
    return `${value}%`;
  }
}

// -----------------------------------------------------------------------------
// Route Coordinate Formatters
// -----------------------------------------------------------------------------

/**
 * Formats latitude and longitude into a readable coordinate pair.
 */
export function formatCoordinates(
  coordinates: JourneyCoordinateValue | null | undefined,
  options?: {
    maximumFractionDigits?: number;
    emptyValue?: string;
  },
): string {
  if (
    !coordinates ||
    !isFiniteNumber(coordinates.latitude) ||
    !isFiniteNumber(coordinates.longitude) ||
    coordinates.latitude < -90 ||
    coordinates.latitude > 90 ||
    coordinates.longitude < -180 ||
    coordinates.longitude > 180
  ) {
    return options?.emptyValue ?? DEFAULT_EMPTY_VALUE;
  }

  const digits = options?.maximumFractionDigits ?? 5;

  return `${coordinates.latitude.toFixed(digits)}, ${coordinates.longitude.toFixed(digits)}`;
}

/**
 * Formats a distance in kilometres.
 */
export function formatDistanceKm(
  distanceKm: number | null | undefined,
  options?: {
    maximumFractionDigits?: number;
    emptyValue?: string;
  },
): string {
  if (!isFiniteNumber(distanceKm) || distanceKm < 0) {
    return options?.emptyValue ?? DEFAULT_EMPTY_VALUE;
  }

  return `${formatNumber(distanceKm, {
    minimumFractionDigits: 0,
    maximumFractionDigits: options?.maximumFractionDigits ?? 1,
  })} km`;
}

// -----------------------------------------------------------------------------
// Identifier Formatters
// -----------------------------------------------------------------------------

/**
 * Returns a trimmed public identifier without altering its value.
 */
export function formatPublicId(
  value: string | null | undefined,
  emptyValue: string = DEFAULT_EMPTY_VALUE,
): string {
  const normalized = value?.trim();

  return normalized || emptyValue;
}

/**
 * Shortens a long identifier for compact table cells.
 *
 * The full identifier should remain available through a detail view or tooltip.
 */
export function formatCompactPublicId(
  value: string | null | undefined,
  options?: {
    prefixLength?: number;
    suffixLength?: number;
    emptyValue?: string;
  },
): string {
  const normalized = value?.trim();

  if (!normalized) {
    return options?.emptyValue ?? DEFAULT_EMPTY_VALUE;
  }

  const prefixLength = options?.prefixLength ?? 8;
  const suffixLength = options?.suffixLength ?? 4;

  if (
    normalized.length <=
    prefixLength + suffixLength + 3
  ) {
    return normalized;
  }

  return `${normalized.slice(0, prefixLength)}...${normalized.slice(-suffixLength)}`;
}

// -----------------------------------------------------------------------------
// General Display Formatters
// -----------------------------------------------------------------------------

/**
 * Converts an optional string into a readable display value.
 */
export function formatDisplayValue(
  value: string | null | undefined,
  emptyValue: string = DEFAULT_EMPTY_VALUE,
): string {
  const normalized = value?.trim();

  return normalized || emptyValue;
}

/**
 * Formats a boolean as a readable Yes/No value.
 */
export function formatBoolean(
  value: boolean | null | undefined,
  options?: {
    trueLabel?: string;
    falseLabel?: string;
    emptyValue?: string;
  },
): string {
  if (value === null || value === undefined) {
    return options?.emptyValue ?? DEFAULT_EMPTY_VALUE;
  }

  return value
    ? options?.trueLabel ?? 'Yes'
    : options?.falseLabel ?? 'No';
}

/**
 * Formats a value that may be a string, number, boolean, or absent.
 */
export function formatUnknownValue(
  value: unknown,
  emptyValue: string = DEFAULT_EMPTY_VALUE,
): string {
  if (value === null || value === undefined) {
    return emptyValue;
  }

  if (typeof value === 'string') {
    return value.trim() || emptyValue;
  }

  if (typeof value === 'number') {
    return isFiniteNumber(value) ? formatNumber(value) : emptyValue;
  }

  if (typeof value === 'boolean') {
    return formatBoolean(value);
  }

  return emptyValue;
}
