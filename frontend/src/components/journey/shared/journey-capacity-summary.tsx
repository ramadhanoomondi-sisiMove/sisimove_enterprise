// -----------------------------------------------------------------------------
// Path: src/features/journey/components/shared/JourneyCapacitySummary.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Capacity Summary
// -----------------------------------------------------------------------------
//
// Compact presentation of Journey passenger capacity.
//
// Marketplace presentation:
//
//   👥 3 seats available · 2 booked · 5 total
//
// Responsibilities:
// - Present total seats.
// - Present currently booked seats.
// - Present backend-derived available seats.
// - Use a subtle Lucide icon for passenger capacity.
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

import { UsersRound } from "lucide-react";

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
        "gap-x-[clamp(0.4rem,0.8vw,0.7rem)]",
        "gap-y-[clamp(0.2rem,0.45vw,0.35rem)]",
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex",
          "min-w-0",
          "items-center",
          "gap-[clamp(0.25rem,0.5vw,0.4rem)]",
          "text-[clamp(0.58rem,0.9vw,0.78rem)]",
          "font-semibold",
          "leading-tight",
          "text-[var(--foreground)]",
        )}
      >
        <UsersRound
          className="size-[clamp(0.68rem,1.05vw,0.88rem)] shrink-0 text-[var(--brand)]"
          aria-hidden="true"
        />

        <span className="min-w-0 truncate">
          {capacity.availableSeats}{" "}
          {capacity.availableSeats === 1 ? "seat" : "seats"} available
        </span>
      </span>

      <span
        aria-hidden="true"
        className="shrink-0 text-[clamp(0.55rem,0.8vw,0.7rem)] text-[var(--foreground-subtle)]"
      >
        ·
      </span>

      <span className="shrink-0 text-[clamp(0.5rem,0.75vw,0.65rem)] leading-tight text-[var(--foreground-secondary)]">
        {capacity.bookedSeats} booked
      </span>

      <span
        aria-hidden="true"
        className="shrink-0 text-[clamp(0.55rem,0.8vw,0.7rem)] text-[var(--foreground-subtle)]"
      >
        ·
      </span>

      <span className="shrink-0 text-[clamp(0.5rem,0.75vw,0.65rem)] leading-tight text-[var(--foreground-muted)]">
        {capacity.totalSeats}{" "}
        {capacity.totalSeats === 1 ? "total seat" : "total seats"}
      </span>
    </div>
  );
}