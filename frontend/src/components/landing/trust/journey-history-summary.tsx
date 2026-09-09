// src/components/landing/trust/journey-history-summary.tsx

// -----------------------------------------------------------------------------
// sisiMove — Landing Journey History Summary
// -----------------------------------------------------------------------------
//
// Public landing-page Trust signal.
//
// Responsibilities:
// - Explain journey history as a public Trust signal.
// - Present an optional completed-journey count.
// - Explain that completed journeys provide meaningful experience signals.
//
// This component does not:
// - calculate journey history;
// - determine whether a journey qualifies as completed;
// - access Booking data;
// - access traveller records;
// - calculate Trust;
// - fetch Trust data;
// - expose cancellation or private journey information.
//
// This is presentation-only.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import type {
  HTMLAttributes,
  ReactNode,
} from 'react';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { cn } from '../../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyHistorySummaryProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'children' | 'title'
  > {
  /**
   * Number of successfully completed journeys.
   *
   * When omitted, the component presents the general Trust concept rather
   * than a traveller-specific count.
   */
  completedJourneys?: number | null;

  /**
   * Public Trust signal label.
   */
  label?: ReactNode;

  /**
   * Optional supporting description.
   */
  description?: ReactNode;

  /**
   * Optional replacement leading visual.
   */
  leadingContent?: ReactNode;

  /**
   * Optional trailing content.
   */
  trailingContent?: ReactNode;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function normalizeCompletedJourneys(
  value: number | null | undefined,
): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    return null;
  }

  return Math.floor(value);
}

// -----------------------------------------------------------------------------
// Default Icon
// -----------------------------------------------------------------------------

function DefaultJourneyHistoryIcon() {
  return (
    <span
      aria-hidden="true"
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600"
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        className="size-5"
      >
        <path
          d="M3.5 5.5h13M5 3.5v3M15 3.5v3M4.5 8.5h11v7H4.5v-7Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M7.5 11.5h3M7.5 13.5h5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyHistorySummary({
  completedJourneys,
  label = 'Journey history',
  description,
  leadingContent,
  trailingContent,
  className,
  ...props
}: JourneyHistorySummaryProps) {
  const count =
    normalizeCompletedJourneys(
      completedJourneys,
    );

  const hasCount = count !== null;

  const resolvedDescription =
    description ??
    (hasCount
      ? count > 0
        ? `${count.toLocaleString()} ${
            count === 1
              ? 'journey'
              : 'journeys'
          } completed successfully.`
        : 'No completed journeys yet.'
      : 'See meaningful experience built through completed journeys.');

  return (
    <div
      className={cn(
        'flex items-start gap-3',
        className,
      )}
      {...props}
    >
      {leadingContent ?? (
        <DefaultJourneyHistoryIcon />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-sm font-semibold text-neutral-950">
            {label}
          </p>

          {hasCount ? (
            <span className="text-sm font-semibold text-neutral-900">
              {count.toLocaleString()}
            </span>
          ) : null}
        </div>

        {resolvedDescription ? (
          <p className="mt-1 text-sm leading-5 text-neutral-600">
            {resolvedDescription}
          </p>
        ) : null}
      </div>

      {trailingContent ? (
        <div className="shrink-0">
          {trailingContent}
        </div>
      ) : null}
    </div>
  );
}