// -----------------------------------------------------------------------------
// sisiMove — Journey Capacity Summary
// -----------------------------------------------------------------------------
//
// Compact presentation of Journey passenger capacity.
//
// Responsibilities:
// - Present total seats.
// - Present currently booked seats.
// - Present backend-derived available seats.
// - Keep booking state visibly read-only.
//
// This component does NOT:
// - calculate available seats;
// - modify booking state;
// - submit capacity mutations;
// - recreate JourneyCapacity domain behavior.
//
// `availableSeats` and `bookedSeats` are displayed exactly as supplied by the
// backend projection.
// -----------------------------------------------------------------------------

import type { JourneyCapacity } from "@/features/journey/models";
import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCapacitySummaryProps {
  /**
   * Journey capacity projection supplied by the backend.
   */
  readonly capacity: JourneyCapacity;

  /**
   * Optional additional CSS classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyCapacitySummary({
  capacity,
  className,
}: JourneyCapacitySummaryProps) {
  return (
    <div
      className={cn(
        "flex",
        "min-w-0",
        "flex-wrap",
        "items-center",
        "gap-x-3",
        "gap-y-1",
        className,
      )}
    >
      <span className="text-sm font-medium text-[var(--foreground)]">
        {capacity.availableSeats}{" "}
        {capacity.availableSeats === 1 ? "seat" : "seats"} available
      </span>

      <span
        aria-hidden="true"
        className="text-[var(--foreground-subtle)]"
      >
        ·
      </span>

      <span className="text-sm text-[var(--foreground-secondary)]">
        {capacity.bookedSeats}{" "}
        {capacity.bookedSeats === 1 ? "booked" : "booked"}
      </span>

      <span
        aria-hidden="true"
        className="text-[var(--foreground-subtle)]"
      >
        ·
      </span>

      <span className="text-sm text-[var(--foreground-muted)]">
        {capacity.totalSeats}{" "}
        {capacity.totalSeats === 1 ? "total seat" : "total seats"}
      </span>
    </div>
  );
}