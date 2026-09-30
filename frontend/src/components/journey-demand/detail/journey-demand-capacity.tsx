// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Capacity
// -----------------------------------------------------------------------------
//
// Detail presentation component for a public Journey Demand's passenger
// requirement.
//
// Product role:
//
//     "How many travellers are looking for this Journey?"
//           │
//           ├── Seats requested
//           │
//           └── Seats already matched
//
// The presentation makes the demand signal immediately visible without
// turning the component into a booking or matching surface.
//
// Responsibilities:
// - present requested seats prominently;
// - present backend-provided matched seats;
// - distinguish requested capacity from matched capacity;
// - communicate that the values represent traveller demand;
// - provide a premium visual anchor for the Demand detail page.
//
// Non-responsibilities:
// - no data fetching;
// - no mutations;
// - no seat calculations;
// - no remaining-seat derivation;
// - no booking semantics;
// - no matching logic.
//
// The PublicJourneyDemandCapacity projection remains authoritative.
// -----------------------------------------------------------------------------

import { CheckCircle2, Users } from "lucide-react";

import type { PublicJourneyDemandCapacity } from "@/features/journey-demand/models";

import { cn } from "@/foundation";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandCapacityProps {
  /**
   * Public Journey Demand capacity projection.
   */
  readonly capacity: PublicJourneyDemandCapacity;

  /**
   * Controls presentation density.
   */
  readonly emphasis?: "compact" | "default";

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandCapacity({
  capacity,
  emphasis = "default",
  className,
}: JourneyDemandCapacityProps) {
  const isCompact = emphasis === "compact";

  return (
    <section
      aria-labelledby="journey-demand-capacity-heading"
      className={cn(
        "min-w-0",
        "space-y-4",
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Section header                                                     */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "flex",
          "min-w-0",
          "items-start",
          "gap-3",
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            "flex",
            "size-9",
            "shrink-0",
            "items-center",
            "justify-center",
            "rounded-[var(--radius-lg)]",
            "bg-[var(--brand-soft)]",
            "text-[var(--brand)]",
          )}
        >
          <Users className="size-4" />
        </div>

        <div className="min-w-0">
          <p
            className={cn(
              "text-[clamp(0.62rem,0.85vw,0.72rem)]",
              "font-bold",
              "uppercase",
              "tracking-[0.12em]",
              "text-[var(--brand)]",
            )}
          >
            Travel demand
          </p>

          <h2
            id="journey-demand-capacity-heading"
            className={cn(
              "mt-1",
              "text-[clamp(1rem,1.7vw,1.25rem)]",
              "font-extrabold",
              "tracking-tight",
              "text-[var(--foreground)]",
            )}
          >
            Travellers looking for this Journey
          </h2>

          <p
            className={cn(
              "mt-1",
              "max-w-2xl",
              "text-sm",
              "leading-6",
              "text-[var(--foreground-muted)]",
            )}
          >
            This Demand shows how many seats travellers are looking for and
            how many have already been matched.
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Capacity hero                                                      */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "overflow-hidden",
          "rounded-[var(--radius-xl)]",
          "border",
          "border-[var(--border)]",
          "bg-[var(--background-brand)]",
          "shadow-[var(--shadow-sm)]",
        )}
      >
        <dl
          className={cn(
            "grid",
            "min-w-0",
            "grid-cols-1",
            "divide-y",
            "divide-[var(--border-subtle)]",
            "sm:grid-cols-2",
            "sm:divide-x",
            "sm:divide-y-0",
          )}
        >
          {/* --------------------------------------------------------------- */}
          {/* Requested seats                                                */}
          {/* --------------------------------------------------------------- */}

          <div
            className={cn(
              "min-w-0",
              isCompact ? "p-4" : "p-5 sm:p-6",
            )}
          >
            <dt
              className={cn(
                "text-xs",
                "font-semibold",
                "uppercase",
                "tracking-[0.08em]",
                "text-[var(--foreground-muted)]",
              )}
            >
              Seats requested
            </dt>

            <dd
              className={cn(
                "mt-2",
                "flex",
                "items-baseline",
                "gap-2",
              )}
            >
              <span
                className={cn(
                  "text-[clamp(2rem,5vw,3.25rem)]",
                  "font-extrabold",
                  "leading-none",
                  "tracking-tight",
                  "text-[var(--foreground)]",
                )}
              >
                {capacity.requestedSeats}
              </span>

              <span
                className={cn(
                  "text-sm",
                  "font-medium",
                  "text-[var(--foreground-secondary)]",
                )}
              >
                {capacity.requestedSeats === 1
                  ? "seat"
                  : "seats"}
              </span>
            </dd>

            <p
              className={cn(
                "mt-2",
                "text-sm",
                "leading-5",
                "text-[var(--foreground-muted)]",
              )}
            >
              Traveller requirement for this Demand.
            </p>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* Matched seats                                                   */}
          {/* --------------------------------------------------------------- */}

          <div
            className={cn(
              "min-w-0",
              isCompact ? "p-4" : "p-5 sm:p-6",
            )}
          >
            <div
              className={cn(
                "flex",
                "items-start",
                "justify-between",
                "gap-3",
              )}
            >
              <dt
                className={cn(
                  "text-xs",
                  "font-semibold",
                  "uppercase",
                  "tracking-[0.08em]",
                  "text-[var(--foreground-muted)]",
                )}
              >
                Matched seats
              </dt>

              <span
                className={cn(
                  "inline-flex",
                  "shrink-0",
                  "items-center",
                  "gap-1.5",
                  "rounded-full",
                  "bg-[var(--success-soft)]",
                  "px-2.5",
                  "py-1",
                  "text-[0.65rem]",
                  "font-semibold",
                  "text-[var(--success)]",
                )}
              >
                <CheckCircle2
                  aria-hidden="true"
                  className="size-3"
                />
                Matched
              </span>
            </div>

            <dd
              className={cn(
                "mt-2",
                "flex",
                "items-baseline",
                "gap-2",
              )}
            >
              <span
                className={cn(
                  "text-[clamp(2rem,5vw,3.25rem)]",
                  "font-extrabold",
                  "leading-none",
                  "tracking-tight",
                  "text-[var(--foreground)]",
                )}
              >
                {capacity.matchedSeats}
              </span>

              <span
                className={cn(
                  "text-sm",
                  "font-medium",
                  "text-[var(--foreground-secondary)]",
                )}
              >
                {capacity.matchedSeats === 1
                  ? "seat"
                  : "seats"}
              </span>
            </dd>

            <p
              className={cn(
                "mt-2",
                "text-sm",
                "leading-5",
                "text-[var(--foreground-muted)]",
              )}
            >
              Seats already connected to available Journey supply.
            </p>
          </div>
        </dl>

        {/* ----------------------------------------------------------------- */}
        {/* Demand signal                                                     */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            "border-t",
            "border-[var(--border-subtle)]",
            "bg-[var(--surface)]",
            isCompact
              ? "px-4 py-3"
              : "px-5 py-4 sm:px-6",
          )}
        >
          <div
            className={cn(
              "flex",
              "min-w-0",
              "items-center",
              "gap-2",
              "text-xs",
              "leading-5",
              "text-[var(--foreground-muted)]",
            )}
          >
            <Users
              aria-hidden="true"
              className={cn(
                "size-3.5",
                "shrink-0",
                "text-[var(--brand)]",
              )}
            />

            <span className="min-w-0">
              This is a live signal of traveller demand. Matching information
              is provided by the Journey Demand projection.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}