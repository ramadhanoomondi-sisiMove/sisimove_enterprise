// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Overview
// -----------------------------------------------------------------------------
//
// Public overview of one Journey Demand.
//
// The Journey Demand overview is the primary presentation surface for a
// traveller's expressed travel need.
//
// Visual hierarchy:
//
//   REAL TRAVEL DEMAND
//   Traveller / status
//   ORIGIN → DESTINATION
//   DATE · TIME
//   SEATS REQUESTED · TARGET PRICE
//
// Responsibilities:
// - present the PublicJourneyDemand marketplace read model;
// - compose public Journey Demand presentation components;
// - expose the core travel-need facts clearly;
// - make the requested Journey visually understandable at a glance;
// - remain read-only and navigation agnostic.
//
// Non-responsibilities:
// - no data fetching;
// - no mutations;
// - no route construction;
// - no lifecycle decisions;
// - no capability inference;
// - no reconstruction of backend aggregate state;
// - no participant identity loading;
// - no derivation of business rules.
//
// PublicJourneyDemand is the authoritative public-read contract.
// -----------------------------------------------------------------------------

import {
  ArrowRight,
  MapPin,
  Route as RouteIcon,
  Users,
} from "lucide-react";

import type { PublicJourneyDemand } from "@/features/journey-demand/models";

import { cn } from "@/foundation";

import {
  JourneyDemandDemandSummary,
  JourneyDemandRequesterSummary,
  JourneyDemandRoute,
  JourneyDemandScheduleSummary,
  JourneyDemandStatusBadge,
} from "../shared";

import { JourneyDemandPricing } from "./journey-demand-pricing";

// =============================================================================
// Props
// =============================================================================

export interface JourneyDemandOverviewProps {
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

export function JourneyDemandOverview({
  demand,
  emphasis = "default",
  className,
}: JourneyDemandOverviewProps) {
  const isCompact = emphasis === "compact";

  return (
    <section
      aria-labelledby="journey-demand-overview-heading"
      className={cn(
        "min-w-0",
        "overflow-hidden",
        "rounded-[var(--radius-xl)]",
        "border",
        "border-[var(--border)]",
        "bg-[var(--surface)]",
        "shadow-[var(--shadow-md)]",
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Demand identity header                                              */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "border-l-4",
          "border-[var(--brand)]",
          "bg-[var(--background-brand)]",
          isCompact
            ? "px-4 py-4"
            : "px-5 py-5 sm:px-6 sm:py-6",
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
          <div className="min-w-0">
            <div
              className={cn(
                "flex",
                "items-center",
                "gap-2",
              )}
            >
              <RouteIcon
                aria-hidden="true"
                className="size-4 shrink-0 text-[var(--brand)]"
              />

              <p
                className={cn(
                  "text-[0.65rem]",
                  "font-bold",
                  "uppercase",
                  "tracking-[0.12em]",
                  "text-[var(--brand)]",
                )}
              >
                Real travel demand
              </p>
            </div>

            <h2
              id="journey-demand-overview-heading"
              className={cn(
                "mt-2",
                "font-extrabold",
                "tracking-tight",
                "text-[var(--foreground)]",
                isCompact
                  ? "text-lg"
                  : "text-[clamp(1.25rem,2.5vw,1.7rem)]",
              )}
            >
              A traveller wants to make this Journey
            </h2>

            <p
              className={cn(
                "mt-1.5",
                "max-w-2xl",
                "leading-6",
                "text-[var(--foreground-muted)]",
                isCompact ? "text-xs" : "text-sm",
              )}
            >
              This Demand shows where a traveller is looking to travel,
              when they want to go, and the capacity they are requesting.
            </p>
          </div>

          <JourneyDemandStatusBadge
            status={demand.status}
            className="shrink-0"
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Requester                                                           */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "border-b",
          "border-[var(--border-subtle)]",
          isCompact
            ? "px-4 py-4"
            : "px-5 py-5 sm:px-6",
        )}
      >
        <JourneyDemandRequesterSummary
          requester={demand.requester}
          emphasis={emphasis}
        />
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Route                                                               */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          isCompact
            ? "px-4 py-5"
            : "px-5 py-6 sm:px-6 sm:py-7",
        )}
      >
        <div
          className={cn(
            "mb-3",
            "flex",
            "items-center",
            "gap-2",
          )}
        >
          <MapPin
            aria-hidden="true"
            className="size-4 text-[var(--brand)]"
          />

          <p
            className={cn(
              "text-[0.65rem]",
              "font-bold",
              "uppercase",
              "tracking-[0.1em]",
              "text-[var(--foreground-muted)]",
            )}
          >
            Journey requested
          </p>
        </div>

        <div
          className={cn(
            "min-w-0",
            "rounded-[var(--radius-lg)]",
            "border",
            "border-[var(--border-subtle)]",
            "bg-[var(--background-subtle)]",
            isCompact ? "p-4" : "p-5",
          )}
        >
          <JourneyDemandRoute
            route={demand.route}
            emphasis={emphasis}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Travel need facts                                                   */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "border-t",
          "border-[var(--border-subtle)]",
          isCompact
            ? "px-4 py-4"
            : "px-5 py-5 sm:px-6",
        )}
      >
        <div
          className={cn(
            "mb-3",
            "text-[0.65rem]",
            "font-bold",
            "uppercase",
            "tracking-[0.1em]",
            "text-[var(--foreground-muted)]",
          )}
        >
          Travel need
        </div>

        <div
          className={cn(
            "grid",
            "min-w-0",
            "grid-cols-1",
            "gap-3",
            "sm:grid-cols-2",
          )}
        >
          {/* ---------------------------------------------------------------- */}
          {/* Schedule                                                         */}
          {/* ---------------------------------------------------------------- */}

          <div
            className={cn(
              "min-w-0",
              "rounded-[var(--radius-lg)]",
              "border",
              "border-[var(--border-subtle)]",
              "bg-[var(--surface)]",
              isCompact ? "p-3" : "p-4",
            )}
          >
            <JourneyDemandScheduleSummary
              schedule={demand.schedule}
              emphasis={emphasis}
            />
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Seats                                                            */}
          {/* ---------------------------------------------------------------- */}

          <div
            className={cn(
              "min-w-0",
              "rounded-[var(--radius-lg)]",
              "border",
              "border-[var(--border-subtle)]",
              "bg-[var(--surface)]",
              isCompact ? "p-3" : "p-4",
            )}
          >
            <div
              className={cn(
                "flex",
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
                    "text-xs",
                    "font-medium",
                    "text-[var(--foreground-muted)]",
                  )}
                >
                  Seats requested
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
                    ? "seat for this travel need"
                    : "seats for this travel need"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Pricing                                                             */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "border-t",
          "border-[var(--border-subtle)]",
          "bg-[var(--background-subtle)]",
          isCompact
            ? "px-4 py-4"
            : "px-5 py-5 sm:px-6",
        )}
      >
        <div
          className={cn(
            "mb-3",
            "flex",
            "items-center",
            "gap-2",
          )}
        >
          <ArrowRight
            aria-hidden="true"
            className="size-4 text-[var(--brand)]"
          />

          <p
            className={cn(
              "text-[0.65rem]",
              "font-bold",
              "uppercase",
              "tracking-[0.1em]",
              "text-[var(--foreground-muted)]",
            )}
          >
            Travel budget
          </p>
        </div>

        <div
          className={cn(
            "rounded-[var(--radius-lg)]",
            "border",
            "border-[var(--border-subtle)]",
            "bg-[var(--surface)]",
            isCompact ? "p-3" : "p-4",
          )}
        >
          <JourneyDemandPricing
            pricing={demand.pricing}
            emphasis={emphasis}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Demand signal                                                       */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "border-t",
          "border-[var(--border-subtle)]",
          "bg-[var(--background-brand)]",
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
          This is a traveller&apos;s expressed travel need. Matching Journey
          supply can respond to this Demand through the marketplace.
        </p>
      </div>
    </section>
  );
}