// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Capacity
// -----------------------------------------------------------------------------
//
// Presentation component for the seat requirement of a public Journey Demand.
//
// Public landing pages should communicate what the traveller is looking for,
// not internal matching state.
//
// Therefore this component intentionally does not expose:
// - matched seats
// - remaining seats
// - matching status
// - booking state
// - internal capacity calculations
//
// -----------------------------------------------------------------------------

import type { HTMLAttributes } from 'react';

import { cn } from '../../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandCapacityProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  requestedSeats: number;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function normalizeRequestedSeats(
  value: number,
): number {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  return Math.floor(value);
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandCapacity({
  requestedSeats,
  className,
  ...props
}: JourneyDemandCapacityProps) {
  const normalizedRequestedSeats =
    normalizeRequestedSeats(requestedSeats);

  const seatLabel =
    normalizedRequestedSeats === 1
      ? 'seat needed'
      : 'seats needed';

  return (
    <div
      className={cn(
        'flex min-w-0 items-start gap-3',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 20v-1.5a3.5 3.5 0 0 1 3.5-3.5h3a3.5 3.5 0 0 1 3.5 3.5V20"
          />
          <circle cx="12" cy="8" r="3.5" />
          <path
            strokeLinecap="round"
            d="M5 20v-1a3 3 0 0 1 2-2.83M19 20v-1a3 3 0 0 0-2-2.83"
          />
        </svg>
      </span>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Looking for
        </p>

        <p className="mt-1 text-sm font-medium text-neutral-950">
          {normalizedRequestedSeats} {seatLabel}
        </p>
      </div>
    </div>
  );
}