// -----------------------------------------------------------------------------
// sisiMove — Traveller History
// -----------------------------------------------------------------------------
//
// Presentation component for the public journey-history portion of traveller
// trust.
//
// Responsibilities:
// - Render publicly available journey-history statistics.
// - Present completed journeys consistently.
// - Optionally render cancelled journeys when the parent explicitly supplies
//   that public projection.
//
// This component does not:
// - calculate journey history;
// - determine whether a journey counts as completed;
// - determine whether cancelled journeys are publicly visible;
// - infer trust or reliability;
// - access APIs;
// - perform authentication or authorization.
//
// All values are server-authoritative public trust projections.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { cn } from '../../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TravellerHistoryProps {
  /**
   * Number of journeys successfully completed by the traveller.
   */
  readonly completedJourneys: number;

  /**
   * Number of publicly visible cancelled journeys.
   *
   * This value should only be supplied when the public Trust projection
   * explicitly permits it to be displayed.
   */
  readonly cancelledJourneys?: number | null;

  /**
   * Whether cancelled-journey statistics should be displayed.
   *
   * The parent owns this presentation decision.
   */
  readonly showCancelled?: boolean;

  /**
   * Optional leading content.
   */
  readonly leadingContent?: ReactNode;

  /**
   * Optional custom label replacing the completed-journey label.
   */
  readonly label?: ReactNode;

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

function normalizeCount(
  value: number | null | undefined,
): number {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    return 0;
  }

  return Math.floor(value);
}

// -----------------------------------------------------------------------------
// Default Icon
// -----------------------------------------------------------------------------

function DefaultHistoryIcon({
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
      <path
        d="M4 5.25h12M4 9.25h8M4 13.25h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <rect
        x="2.75"
        y="2.75"
        width="14.5"
        height="14.5"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerHistory({
  completedJourneys,
  cancelledJourneys = null,
  showCancelled = false,
  leadingContent,
  label,
  size = 'sm',
  className,
}: TravellerHistoryProps) {
  const completed =
    normalizeCount(completedJourneys);

  const cancelled =
    normalizeCount(cancelledJourneys);

  const hasCancelled =
    showCancelled &&
    cancelled > 0;

  const resolvedLabel =
    label ??
    (
      completed === 1
        ? 'completed journey'
        : 'completed journeys'
    );

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
        'gap-y-2',
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Completed journeys                                                  */}
      {/* ------------------------------------------------------------------- */}

      <span
        className={cn(
          'inline-flex',
          'items-center',
          'gap-1.5',
          'whitespace-nowrap',
          textSize,
          'text-[var(--foreground-muted)]',
        )}
      >
        {leadingContent ?? (
          <DefaultHistoryIcon
            size={size}
          />
        )}

        <span>
          <span
            className="font-semibold text-[var(--foreground)]"
          >
            {completed}
          </span>{' '}
          {resolvedLabel}
        </span>
      </span>

      {/* ------------------------------------------------------------------- */}
      {/* Cancelled journeys                                                  */}
      {/* ------------------------------------------------------------------- */}

      {hasCancelled && (
        <span
          className={cn(
            'whitespace-nowrap',
            textSize,
            'text-[var(--foreground-muted)]',
          )}
        >
          <span
            className="font-semibold text-[var(--foreground)]"
          >
            {cancelled}
          </span>{' '}
          {cancelled === 1
            ? 'cancelled journey'
            : 'cancelled journeys'}
        </span>
      )}
    </div>
  );
}