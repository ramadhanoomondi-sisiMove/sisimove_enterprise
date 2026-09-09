// -----------------------------------------------------------------------------
// sisiMove — Traveller Availability
// -----------------------------------------------------------------------------
//
// Presentation component for publicly visible journey seat availability.
//
// Responsibilities:
// - Render the server-authoritative number of available seats.
// - Optionally render total seat capacity.
// - Provide compact presentation for public traveller activity cards.
//
// This component does not:
// - calculate availability;
// - infer booking state;
// - fetch booking information;
// - perform booking;
// - determine whether a journey is bookable;
// - contain Commercial or Financial logic.
//
// Important:
// `available` is authoritative public projection data. The frontend must not
// calculate it from capacity, bookings, or any other local state.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { cn } from '../../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type TravellerAvailabilitySize =
  | 'sm'
  | 'md';

export interface TravellerAvailabilityProps {
  /**
   * Total seat capacity of the public journey.
   */
  readonly capacity: number;

  /**
   * Number of seats currently available.
   *
   * This value is server-authoritative.
   */
  readonly available: number;

  /**
   * Optional custom label.
   *
   * When omitted, the label is generated from `available`.
   */
  readonly label?: ReactNode;

  /**
   * Whether to display the total capacity.
   */
  readonly showCapacity?: boolean;

  /**
   * Optional presentation content displayed before the availability.
   *
   * Suitable for an icon or other presentation-only content.
   */
  readonly leadingContent?: ReactNode;

  /**
   * Compact presentation.
   */
  readonly size?: TravellerAvailabilitySize;

  /**
   * Optional class name.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function normalizeNonNegativeInteger(
  value: number,
): number | null {
  if (!Number.isFinite(value)) {
    return null;
  }

  const normalized = Math.floor(value);

  return normalized >= 0
    ? normalized
    : null;
}

function getDefaultLabel(
  available: number,
): string {
  return available === 1
    ? '1 seat available'
    : `${available} seats available`;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerAvailability({
  capacity,
  available,
  label,
  showCapacity = false,
  leadingContent,
  size = 'sm',
  className,
}: TravellerAvailabilityProps) {
  const normalizedCapacity =
    normalizeNonNegativeInteger(capacity);

  const normalizedAvailable =
    normalizeNonNegativeInteger(available);

  if (
    normalizedCapacity === null ||
    normalizedAvailable === null
  ) {
    return null;
  }

  const resolvedLabel =
    label ?? getDefaultLabel(normalizedAvailable);

  const hasCapacity =
    showCapacity;

  const hasLeadingContent =
    leadingContent !== null &&
    leadingContent !== undefined;

  const textSize =
    size === 'sm'
      ? 'text-xs'
      : 'text-sm';

  const iconSize =
    size === 'sm'
      ? 'h-3.5 w-3.5'
      : 'h-4 w-4';

  const isFull =
    normalizedAvailable === 0;

  return (
    <div
      className={cn(
        'inline-flex',
        'min-w-0',
        'items-center',
        'gap-1.5',
        textSize,
        isFull
          ? 'text-[var(--foreground-muted)]'
          : 'text-[var(--foreground)]',
        className,
      )}
    >
      {hasLeadingContent && (
        <span
          aria-hidden="true"
          className="inline-flex shrink-0 items-center text-[var(--foreground-muted)]"
        >
          {leadingContent}
        </span>
      )}

      <svg
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
        className={cn(
          'shrink-0',
          iconSize,
        )}
      >
        <path
          d="M4 6.25h12M5.5 10h9M7 13.75h6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        <path
          d="M3 4.25h14v11.5H3z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>

      <span className="whitespace-nowrap">
        <span className="font-medium">
          {resolvedLabel}
        </span>

        {hasCapacity && (
          <span className="text-[var(--foreground-muted)]">
            {' '}
            of {normalizedCapacity}
          </span>
        )}
      </span>
    </div>
  );
}