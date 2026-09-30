// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Matching Summary
// -----------------------------------------------------------------------------
//
// Public detail presentation of Journey Demand participation and matching
// evidence.
//
// The public Journey Demand projection deliberately separates:
//
// - demand participation:
//     participantCount
//     joinedSeats
//
// - capacity / matching:
//     requestedSeats
//     matchedSeats
//
// This component presents those backend-provided facts together so travellers
// can understand the current Demand without reconstructing the aggregate.
//
// Responsibilities:
// - present public participation evidence;
// - present backend-provided matched-seat information;
// - present the public Demand lifecycle status;
// - explain the distinction between people who joined and seats currently
//   matched.
//
// Non-responsibilities:
// - no data fetching;
// - no mutations;
// - no remaining-seat calculation;
// - no "fully matched" inference;
// - no participant identity loading;
// - no matching decisions;
// - no lifecycle transitions;
// - no Journey creation logic.
//
// The backend public projection remains authoritative.
// -----------------------------------------------------------------------------

import {
  ArrowRight,
  CheckCircle2,
  Users,
} from "lucide-react";

import type { PublicJourneyDemand } from "@/features/journey-demand/models";

import { cn } from "@/foundation";

import {
  JourneyDemandDemandSummary,
  JourneyDemandStatusBadge,
} from "../shared";

// =============================================================================
// Props
// =============================================================================

export interface JourneyDemandMatchingSummaryProps {
  /**
   * Public Journey Demand read model.
   */
  readonly demand: PublicJourneyDemand;

  /**
   * Controls presentation density.
   */
  readonly emphasis?: "compact" | "default";

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyDemandMatchingSummary({
  demand,
  emphasis = "default",
  className,
}: JourneyDemandMatchingSummaryProps) {
  const isCompact = emphasis === "compact";

  return (
    <section
      aria-labelledby="journey-demand-matching-summary-heading"
      className={cn(
        "min-w-0",
        "overflow-hidden",
        "rounded-[var(--radius-xl)]",
        "border",
        "border-[var(--border)]",
        "bg-[var(--surface)]",
        "shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "border-b",
          "border-[var(--border-subtle)]",
          "bg-[var(--background-brand)]",
          isCompact
            ? "px-4 py-4"
            : "px-5 py-5 sm:px-6",
        )}
      >
        <div
          className={cn(
            "flex",
            "min-w-0",
            "items-start",
            "justify-between",
            "gap-4",
          )}
        >
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
                  "text-[0.65rem]",
                  "font-bold",
                  "uppercase",
                  "tracking-[0.12em]",
                  "text-[var(--brand)]",
                )}
              >
                Demand matching
              </p>

              <h2
                id="journey-demand-matching-summary-heading"
                className={cn(
                  "mt-1",
                  "font-extrabold",
                  "tracking-tight",
                  "text-[var(--foreground)]",
                  isCompact
                    ? "text-base"
                    : "text-[clamp(1.05rem,1.8vw,1.3rem)]",
                )}
              >
                Travellers are signalling interest
              </h2>

              <p
                className={cn(
                  "mt-1",
                  "leading-6",
                  "text-[var(--foreground-muted)]",
                  isCompact ? "text-xs" : "text-sm",
                )}
              >
                See the participation and matching evidence currently exposed
                by this Demand.
              </p>
            </div>
          </div>

          <JourneyDemandStatusBadge
            status={demand.status}
            className="shrink-0"
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Participation                                                       */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          isCompact
            ? "p-4"
            : "p-5 sm:p-6",
        )}
      >
        <div className="min-w-0">
          <div
            className={cn(
              "flex",
              "items-center",
              "gap-2",
            )}
          >
            <Users
              aria-hidden="true"
              className="size-4 text-[var(--brand)]"
            />

            <h3
              className={cn(
                "font-bold",
                "text-[var(--foreground)]",
                isCompact ? "text-sm" : "text-base",
              )}
            >
              Traveller participation
            </h3>
          </div>

          <p
            className={cn(
              "mt-1",
              "text-[var(--foreground-muted)]",
              isCompact ? "text-xs" : "text-sm",
            )}
          >
            People and seats currently represented in this travel need.
          </p>
        </div>

        <div className="mt-4">
          <JourneyDemandDemandSummary
            capacity={demand.capacity}
            demand={demand.demand}
            emphasis={emphasis}
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Matching evidence                                                 */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            "mt-5",
            "rounded-[var(--radius-lg)]",
            "border",
            "border-[var(--border-subtle)]",
            "bg-[var(--background-subtle)]",
            isCompact ? "p-4" : "p-5",
          )}
        >
          <div
            className={cn(
              "flex",
              "items-center",
              "gap-2",
              "text-xs",
              "font-semibold",
              "uppercase",
              "tracking-[0.08em]",
              "text-[var(--foreground-muted)]",
            )}
          >
            <CheckCircle2
              aria-hidden="true"
              className="size-3.5 text-[var(--brand)]"
            />

            Matching evidence
          </div>

          <div
            className={cn(
              "mt-4",
              "grid",
              "min-w-0",
              "grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]",
              "items-center",
              "gap-3",
            )}
          >
            <div className="min-w-0">
              <p
                className={cn(
                  "text-xs",
                  "font-medium",
                  "text-[var(--foreground-muted)]",
                )}
              >
                Requested
              </p>

              <p
                className={cn(
                  "mt-1",
                  "font-extrabold",
                  "leading-none",
                  "tracking-tight",
                  "text-[var(--foreground)]",
                  isCompact ? "text-xl" : "text-2xl",
                )}
              >
                {demand.capacity.requestedSeats}
              </p>

              <p
                className={cn(
                  "mt-1",
                  "text-xs",
                  "text-[var(--foreground-muted)]",
                )}
              >
                {demand.capacity.requestedSeats === 1
                  ? "seat"
                  : "seats"}
              </p>
            </div>

            <ArrowRight
              aria-hidden="true"
              className="size-4 shrink-0 text-[var(--foreground-subtle)]"
            />

            <div className="min-w-0 text-right">
              <p
                className={cn(
                  "text-xs",
                  "font-medium",
                  "text-[var(--foreground-muted)]",
                )}
              >
                Matched
              </p>

              <p
                className={cn(
                  "mt-1",
                  "font-extrabold",
                  "leading-none",
                  "tracking-tight",
                  "text-[var(--foreground)]",
                  isCompact ? "text-xl" : "text-2xl",
                )}
              >
                {demand.capacity.matchedSeats}
              </p>

              <p
                className={cn(
                  "mt-1",
                  "text-xs",
                  "text-[var(--foreground-muted)]",
                )}
              >
                {demand.capacity.matchedSeats === 1
                  ? "seat"
                  : "seats"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Explanation                                                         */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "border-t",
          "border-[var(--border-subtle)]",
          "bg-[var(--background-subtle)]",
          isCompact
            ? "px-4 py-3"
            : "px-5 py-4 sm:px-6",
        )}
      >
        <p
          className={cn(
            "text-xs",
            "leading-5",
            "text-[var(--foreground-muted)]",
          )}
        >
          Matched seats represent the portion of the requested capacity
          currently associated with Journey supply through the Demand matching
          process.
        </p>
      </div>
    </section>
  );
}