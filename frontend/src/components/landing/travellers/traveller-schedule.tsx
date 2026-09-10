// -----------------------------------------------------------------------------
// sisiMove — Traveller Schedule
// -----------------------------------------------------------------------------
//
// Presentation component for public traveller activity schedules.
//
// Responsibilities:
// - Render a concise public schedule.
// - Support fixed and flexible presentation.
// - Display caller-supplied labels when the source projection already provides
//   presentation-ready flexible schedule information.
//
// This component does not:
// - determine schedule flexibility;
// - calculate arrival/departure times;
// - interpret booking windows;
// - apply timezone business rules;
// - access Journey or Demand APIs.
//
// The component consumes presentation-ready timestamps and timezone values.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import {
  formatDate,
  formatTime,
} from '../../../foundation/formatters';

import { cn } from '../../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type TravellerScheduleType =
  | 'FIXED'
  | 'FLEXIBLE';

export interface TravellerScheduleProps {
  /**
   * Public departure timestamp.
   *
   * Expected to be an ISO-8601 timestamp.
   */
  readonly departureAt?: string | null;

  /**
   * Public arrival timestamp.
   *
   * Expected to be an ISO-8601 timestamp.
   */
  readonly arrivalAt?: string | null;

  /**
   * Public schedule timezone.
   *
   * Example: Africa/Nairobi
   */
  readonly timezone?: string | null;

  /**
   * Whether the schedule is fixed or flexible.
   *
   * This is a presentation-level classification supplied by the parent.
   */
  readonly type?: TravellerScheduleType;

  /**
   * Optional display override for the date.
   *
   * Useful for flexible schedule windows.
   */
  readonly dateLabel?: ReactNode;

  /**
   * Optional display override for the departure portion.
   *
   * Example: "Flexible departure".
   */
  readonly departureLabel?: ReactNode;

  /**
   * Optional custom leading content.
   */
  readonly leadingContent?: ReactNode;

  /**
   * Presentation size.
   */
  readonly size?: 'sm' | 'md';

  /**
   * Optional additional class name.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function normalizeText(
  value: string | null | undefined,
): string | null {
  const normalized = value?.trim();

  return normalized || null;
}

function formatPublicDate(
  value: string | null | undefined,
  timezone: string | null | undefined,
): string | null {
  const normalizedValue =
    normalizeText(value);

  if (!normalizedValue) {
    return null;
  }

  try {
    return formatDate(
      normalizedValue,
      {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        timeZone:
          normalizeText(timezone) ??
          undefined,
      },
    );
  } catch {
    return null;
  }
}

function formatPublicTime(
  value: string | null | undefined,
  timezone: string | null | undefined,
): string | null {
  const normalizedValue =
    normalizeText(value);

  if (!normalizedValue) {
    return null;
  }

  try {
    return formatTime(
      normalizedValue,
      {
        timeZone:
          normalizeText(timezone) ??
          undefined,
      },
    );
  } catch {
    return null;
  }
}

// -----------------------------------------------------------------------------
// Default Icon
// -----------------------------------------------------------------------------

function DefaultScheduleIcon({
  size,
}: {
  readonly size: 'sm' | 'md';
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={
        size === 'sm'
          ? 'h-3.5 w-3.5 shrink-0'
          : 'h-4 w-4 shrink-0'
      }
    >
      <rect
        x="3"
        y="4.5"
        width="14"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <path
        d="M6.5 2.75v3M13.5 2.75v3M3 8h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerSchedule({
  departureAt,
  arrivalAt,
  timezone,
  type = 'FIXED',
  dateLabel,
  departureLabel,
  leadingContent,
  size = 'sm',
  className,
}: TravellerScheduleProps) {
  const normalizedTimezone =
    normalizeText(timezone);

  const normalizedDepartureAt =
    normalizeText(departureAt);

  const normalizedArrivalAt =
    normalizeText(arrivalAt);

  const formattedDate =
    dateLabel ??
    formatPublicDate(
      normalizedDepartureAt,
      normalizedTimezone,
    );

  const formattedDeparture =
    type === 'FIXED'
      ? formatPublicTime(
          normalizedDepartureAt,
          normalizedTimezone,
        )
      : null;

  const formattedArrival =
    type === 'FIXED'
      ? formatPublicTime(
          normalizedArrivalAt,
          normalizedTimezone,
        )
      : null;

  const resolvedDepartureLabel =
    departureLabel ??
    (type === 'FLEXIBLE'
      ? 'Flexible departure'
      : formattedDeparture);

  const hasDate =
    Boolean(formattedDate);

  const hasTime =
    Boolean(resolvedDepartureLabel) ||
    Boolean(formattedArrival);

  if (
    !hasDate &&
    !hasTime &&
    !leadingContent
  ) {
    return null;
  }

  const textSize =
    size === 'sm'
      ? 'text-xs'
      : 'text-sm';

  return (
    <div
      className={cn(
        'flex',
        'flex-wrap',
        'items-center',
        'gap-x-3',
        'gap-y-1.5',
        textSize,
        'text-[var(--foreground-muted)]',
        className,
      )}
    >
      {leadingContent ?? (
        <DefaultScheduleIcon
          size={size}
        />
      )}

      {hasDate && (
        <span
          className={cn(
            'whitespace-nowrap',
            'font-medium',
            'text-[var(--foreground)]',
          )}
        >
          {formattedDate}
        </span>
      )}

      {hasDate && hasTime && (
        <span
          aria-hidden="true"
          className="text-[var(--foreground-subtle)]"
        >
          ·
        </span>
      )}

      {hasTime && (
        <span className="whitespace-nowrap">
          {resolvedDepartureLabel}

          {type === 'FIXED' &&
            formattedArrival && (
              <>
                <span
                  aria-hidden="true"
                  className="mx-1.5 text-[var(--foreground-subtle)]"
                >
                  →
                </span>

                <span>
                  {formattedArrival}
                </span>
              </>
            )}
        </span>
      )}
    </div>
  );
}