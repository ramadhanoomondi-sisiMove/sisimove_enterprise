// -----------------------------------------------------------------------------
// sisiMove — Journey Capacity
// -----------------------------------------------------------------------------
//
// Presents the Journey's seat capacity.
//
// Responsibilities:
// - present total seats;
// - present booked seats;
// - present available seats.
//
// Non-responsibilities:
// - no API calls;
// - no data fetching;
// - no booking logic;
// - no seat calculations;
// - no mutation;
// - no inference.
//
// `availableSeats` is derived by the backend and is therefore authoritative.
// The frontend must not recalculate it from totalSeats - bookedSeats.
//
// -----------------------------------------------------------------------------

import { cn } from "@/foundation";

import type { JourneyCapacity as JourneyCapacityModel } from "@/features/journey/models";

import { JourneyCapacitySummary } from "../shared";

export interface JourneyCapacityProps {
  readonly capacity: JourneyCapacityModel;
  readonly className?: string;
}

export function JourneyCapacity({
  capacity,
  className,
}: JourneyCapacityProps) {
  return (
    <section
      className={cn(
        "w-full",
        "rounded-[var(--radius-lg)]",
        "border border-[var(--border)]",
        "bg-[var(--surface)]",
        "p-4",
        className,
      )}
      aria-labelledby="journey-capacity-heading"
    >
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">
          Seats
        </p>

        <h2
          id="journey-capacity-heading"
          className="mt-1 text-lg font-semibold text-[var(--foreground)]"
        >
          Journey capacity
        </h2>

        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Seat availability for this Journey.
        </p>
      </div>

      <div
        className={cn(
          "rounded-[var(--radius-md)]",
          "bg-[var(--background-subtle)]",
          "p-4",
        )}
      >
        <JourneyCapacitySummary capacity={capacity} />
      </div>
    </section>
  );
}