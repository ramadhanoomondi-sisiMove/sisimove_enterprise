// -----------------------------------------------------------------------------
// sisiMove — Journey Capacity
// -----------------------------------------------------------------------------
//
// Presents the Journey's current seat availability.
//
// Product role:
//
//     Available seats
//          │
//          ▼
//     Booking confidence
//          │
//          ▼
//     Traveller action
//
// Responsibilities:
// - present total seats;
// - present booked seats;
// - present backend-authoritative available seats;
// - make current availability visually prominent.
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

import {
  CheckCircle2,
  UsersRound,
} from "lucide-react";

import { cn } from "@/foundation";

import type { JourneyCapacity as JourneyCapacityModel } from "@/features/journey/models";

import { JourneyCapacitySummary } from "../shared";

// =============================================================================
// Props
// =============================================================================

export interface JourneyCapacityProps {
  readonly capacity: JourneyCapacityModel;
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyCapacity({
  capacity,
  className,
}: JourneyCapacityProps) {
  const hasAvailableSeats = capacity.availableSeats > 0;

  return (
    <section
      className={cn(
        "w-full",
        "overflow-hidden",
        "rounded-[var(--radius-xl)]",
        "border",
        "border-[var(--border)]",
        "bg-[var(--surface)]",
        className,
      )}
      aria-labelledby="journey-capacity-heading"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "flex",
          "items-start",
          "justify-between",
          "gap-4",
          "border-b",
          "border-[var(--border-subtle)]",
          "px-5",
          "py-4",
          "sm:px-6",
          "sm:py-5",
        )}
      >
        <div className="min-w-0">
          <div
            className={cn(
              "inline-flex",
              "items-center",
              "gap-2",
              "text-xs",
              "font-bold",
              "uppercase",
              "tracking-[0.14em]",
              "text-[var(--brand)]",
            )}
          >
            <UsersRound
              aria-hidden="true"
              className="size-3.5"
            />

            <span>Seats</span>
          </div>

          <h2
            id="journey-capacity-heading"
            className={cn(
              "mt-1.5",
              "text-xl",
              "font-bold",
              "tracking-tight",
              "text-[var(--foreground)]",
            )}
          >
            Make your Journey together.
          </h2>

          <p
            className={cn(
              "mt-1",
              "max-w-xl",
              "text-sm",
              "leading-5",
              "text-[var(--foreground-muted)]",
            )}
          >
            Current seat availability for this Journey.
          </p>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Availability signal                                               */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            "hidden",
            "shrink-0",
            "items-center",
            "gap-1.5",
            "rounded-full",
            "px-3",
            "py-1.5",
            "text-xs",
            "font-semibold",
            "sm:inline-flex",
            hasAvailableSeats
              ? [
                  "border",
                  "border-[var(--success)]/20",
                  "bg-[var(--success-soft)]",
                  "text-[var(--success)]",
                ].join(" ")
              : [
                  "border",
                  "border-[var(--border)]",
                  "bg-[var(--background-subtle)]",
                  "text-[var(--foreground-muted)]",
                ].join(" "),
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "size-1.5",
              "rounded-full",
              hasAvailableSeats
                ? "bg-[var(--success)]"
                : "bg-[var(--foreground-subtle)]",
            )}
          />

          <span>
            {hasAvailableSeats
              ? "Seats available"
              : "Currently full"}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Availability                                                         */}
      {/* ------------------------------------------------------------------- */}

      <div className="p-4 sm:p-5">
        <div
          className={cn(
            "rounded-[var(--radius-lg)]",
            "border",
            hasAvailableSeats
              ? "border-[var(--success)]/20"
              : "border-[var(--border)]",
            hasAvailableSeats
              ? "bg-[var(--success-soft)]"
              : "bg-[var(--background-subtle)]",
          )}
        >
          <div
            className={cn(
              "flex",
              "flex-col",
              "gap-5",
              "p-5",
              "sm:flex-row",
              "sm:items-center",
              "sm:justify-between",
              "sm:p-6",
            )}
          >
            {/* ------------------------------------------------------------- */}
            {/* Primary availability                                          */}
            {/* ------------------------------------------------------------- */}

            <div className="flex items-center gap-4">
              <div
                aria-hidden="true"
                className={cn(
                  "flex",
                  "size-12",
                  "shrink-0",
                  "items-center",
                  "justify-center",
                  "rounded-full",
                  hasAvailableSeats
                    ? "bg-[var(--surface)] text-[var(--success)]"
                    : "bg-[var(--surface)] text-[var(--foreground-muted)]",
                  "shadow-[var(--shadow-sm)]",
                )}
              >
                {hasAvailableSeats ? (
                  <CheckCircle2 className="size-6" />
                ) : (
                  <UsersRound className="size-6" />
                )}
              </div>

              <div>
                <p
                  className={cn(
                    "text-3xl",
                    "font-extrabold",
                    "tracking-tight",
                    hasAvailableSeats
                      ? "text-[var(--foreground)]"
                      : "text-[var(--foreground-secondary)]",
                  )}
                >
                  {capacity.availableSeats}
                </p>

                <p
                  className={cn(
                    "mt-0.5",
                    "text-sm",
                    "font-semibold",
                    hasAvailableSeats
                      ? "text-[var(--success)]"
                      : "text-[var(--foreground-muted)]",
                  )}
                >
                  {capacity.availableSeats === 1
                    ? "seat available"
                    : "seats available"}
                </p>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Capacity summary                                               */}
            {/* ------------------------------------------------------------- */}

            <div
              className={cn(
                "w-full",
                "sm:max-w-sm",
                "sm:border-l",
                "sm:border-[var(--border)]",
                "sm:pl-6",
              )}
            >
              <JourneyCapacitySummary capacity={capacity} />
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Supporting message                                                */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            "mt-3",
            "flex",
            "items-start",
            "gap-2",
            "px-1",
            "text-xs",
            "leading-5",
            "text-[var(--foreground-muted)]",
          )}
        >
          <UsersRound
            aria-hidden="true"
            className="mt-0.5 size-3.5 shrink-0 text-[var(--brand)]"
          />

          <p>
            {hasAvailableSeats
              ? "Choose the number of seats you need when booking this Journey."
              : "This Journey currently has no available seats."}
          </p>
        </div>
      </div>
    </section>
  );
}

export default JourneyCapacity;